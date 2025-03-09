"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">The Future of</span>
            <span className="block text-retro-green">Meme Coins</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl">
            NoRugz empowers you to trade, create, and analyze meme coins with
            AI-powered tools. Stay ahead of trends and avoid rugs with our
            advanced platform.
          </p>
          <a
            href="#get-started"
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out inline-block"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
