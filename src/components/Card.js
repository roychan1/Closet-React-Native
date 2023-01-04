import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Animated, View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { Context as NeedNewCardContext } from '../contexts/NeedNewCardContext';
import usePanResponder from '../hooks/usePanResponder';

const window = Dimensions.get("window");

export default Card = ({id}) => {
    // const [containerMarginHorizontal, setContainerMarginHorizontal] = useState(0);
    const [horizontalRange, setHorizontalRange] = useState(0);
    const [verticalRange, setVerticalRange] = useState(0);
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [swipedRight, setSwipedRight] = useState(false);
    const [swipedDown, setSwipedDown] = useState(false);

    const needNewCard = useContext(NeedNewCardContext);

    const pan = useRef(new Animated.ValueXY()).current;

    // on layout of imageView, set width of container based on image width
    // const imageViewOnLayout = useCallback(event => {
    //     const { width } = event.nativeEvent.layout;
    //     // last number subtracted (ex. 20) is the margin from side of image (ea. side)
    //     const margin = ((window.width - width) / 2) - 20;
    //     setContainerMarginHorizontal(margin);
    // }, [containerMarginHorizontal]);

    const pr = usePanResponder(pan, setHorizontalRange, setVerticalRange, 
        setSwipedLeft, setSwipedRight, setSwipedDown);

    useEffect(() => {
        if (needNewCard.state) {
            if (swipedLeft) {
                setSwipedLeft(false);
            } else if (swipedRight) {

            } else if (swipedDown) {

            }
            
            needNewCard.toggleState();
        }
    }, [needNewCard.state, swipedLeft, swipedRight, swipedDown]);


    return (
        <Animated.View style={{
            transform: [
                {translateX:
                    pan.x.interpolate({
                        inputRange: [-1 * horizontalRange, horizontalRange],
                        outputRange: [-1 * horizontalRange, horizontalRange],
                        extrapolate: 'clamp'
                    })
                },
                {translateY:
                    pan.y.interpolate({
                        inputRange: [0, verticalRange],
                        outputRange: [0, verticalRange],
                        extrapolate: 'clamp'
                    })
                }
            ],
            // marginHorizontal: containerMarginHorizontal, 
            ...styles.container
        }} {...pr.panHandlers}>
            <View 
                style={styles.viewImage}
                // onLayout={imageViewOnLayout}
            >
                <Image 
                    style={styles.image} 
                    source={require('../../assets/test3-image.jpg')}
                />
            </View>
            <View style={styles.viewDescription}>
                <Text style={styles.textDescription}>
                    #men #shirt # shorts #white #black #blue
                    
                </Text>
                <Text style={styles.textDescription}>
                    @user123
                </Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        // marginHorizontal set above, dynamically (previously)
        backgroundColor: 'rgba(225, 225, 225, 1)',
        flex: 1,
        marginVertical: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
        marginHorizontal: 30,
        borderWidth: 1
    },
    image: {
        // height: '100%',
        // aspectRatio: 3/4,
        // // borderRadius: 10,

        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    textDescription: {
        fontSize: 18,
        marginHorizontal: 20,   //no vertical b/c space-around overrides
        color: 'rgba(100, 100, 100, 1)',
        textAlign: 'left',
        alignSelf: 'stretch',
        // backgroundColor: 'yellow'
    },
    viewImage: {
        marginVertical: 20,
        // backgroundColor: 'blue',
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        alignSelf: 'stretch',
        // maxWidth: window.width,
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        padding: 3,
    },
    viewDescription: {
        flex: 1,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        alignSelf: 'stretch',
        // backgroundColor: 'red'
    },
})