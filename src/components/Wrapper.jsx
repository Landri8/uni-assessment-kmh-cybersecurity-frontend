import React from 'react'
import { animated, useSpring } from '@react-spring/web'

const Wrapper = ({children}) => {

    const [props, api] = useSpring(
        () => ({
          from: { opacity: 0 },
          to: { opacity: 1 },
          config: { duration: 400 },
        }),
        []
    )

    return (
        <animated.section style={props} className='w-1/3 mx-auto min-h-screen flex flex-col items-center justify-center py-12 font-inter'>
            {children}
        </animated.section>
    )
}

export default Wrapper