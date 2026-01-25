import React from 'react'

import Hero from '../components/comman/Hero'

import Pricing from '../components/comman/Pricing'
import Testimonials from '../components/comman/Testimonials'
import Disclaimer from '../components/comman/Disclaimer'


const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Global Navigation */}


            {/* Main Landing Sections */}
            <main>
                <Hero />

                <Pricing />
                <Testimonials />
                <Disclaimer />
            </main>

            {/* Global Footer */}

        </div>
    )
}

export default Home