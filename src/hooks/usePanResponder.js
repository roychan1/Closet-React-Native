import { useRef, useState, useContext } from 'react';
import { PanResponder, Animated } from 'react-native';
import { Context as NeedNewCardContext } from '../contexts/NeedNewCardContext';

const HORIZONTAL_RANGE_MAX = 400;
const VERTICAL_RANGE_MAX = 800;
const RELEASE_REGISTER_THRESHOLD = 100;


export default usePanResponder = (pan, setHorizontalRange, setVerticalRange, setSwipedLeft, setSwipedRight, setSwipedDown) => {
    const [sliding, setSliding] = useState(false);

    const needNewCard = useContext(NeedNewCardContext);

    const pr = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { 
                    useNativeDriver: false,
                    listener: (event, gestureState) => {
                        if (sliding === false) {
                            if (Math.abs(gestureState.dx) >= Math.abs(gestureState.dy) && Math.abs(gestureState.dx) >= 5) {
                                setHorizontalRange(HORIZONTAL_RANGE_MAX);
                                setVerticalRange(0);
                                const x = gestureState.dx;
                                const y = 0;
                                Animated.spring( pan, { toValue: {x, y}, useNativeDriver: false } ).start();
                                setSliding(true);
                            } else if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) >= 5) {
                                setVerticalRange(VERTICAL_RANGE_MAX);
                                setHorizontalRange(0);
                                const x = 0;
                                const y = gestureState.dy;
                                Animated.spring( pan, { toValue: {x, y}, useNativeDriver: false } ).start();
                                setSliding(true);
                            }
                        }
                    }
                }
            ),
            onPanResponderRelease: () => {
                setSliding(false);
                let x = 0;
                let y = 0;
                pan.stopAnimation(value => {
                    if (Math.abs(value.x) >= Math.abs(value.y)) {
                        // more horizontal movement than vertical movement
                        if (value.x > RELEASE_REGISTER_THRESHOLD) {
                            x = HORIZONTAL_RANGE_MAX;
                            setSwipedRight(true);
                        } else if (value.x < -RELEASE_REGISTER_THRESHOLD) {
                            x = -HORIZONTAL_RANGE_MAX;
                            setSwipedLeft(true);
                        }
                    } else if (value.y > RELEASE_REGISTER_THRESHOLD) {
                        // more vertical movement than horizontal movement
                        y = VERTICAL_RANGE_MAX;
                        setSwipedDown(true);
                    }
                });
                Animated.spring( pan, { toValue: {x, y}, useNativeDriver: false } ).start();

                if (x !== 0 || y !== 0) {
                    needNewCard.toggleState();      // Switch false to true
                }
            },
        })
    ).current;

    return pr;
}