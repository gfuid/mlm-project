import React from 'react'

import Hero from '../components/Hero'

import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import Disclaimer from '../components/Disclaimer'


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