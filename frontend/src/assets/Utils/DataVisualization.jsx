/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, Globe } from "lucide-react";

const AnimatedCounter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startCount = () => {
      const increment = end / (duration * 60);
      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, 16);
    };

    startCount();
  }, [end, duration]);

  return (
    <motion.div
      className="text-3xl font-bold text-orange-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {count.toLocaleString()}
    </motion.div>
  );
};

const GlobalImpactCard = ({ icon: Icon, end, label, color }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-blue-100 to-blue-200  rounded-md shadow-md  p-6 text-center "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full ${color} bg-opacity-10`}
      >
        <Icon className="text-current" size={32} />
      </div>
      <AnimatedCounter end={end} />
      <p className="text-black font-medium mt-2">{label}</p>
    </motion.div>
  );
};

const DataVisualizationSection = () => {
  return (
    <section className="relative bg-white py-12 md:py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
          Our <span className="text-orange-500">Global</span> Impact
        </h2>

        <div className="flex justify-center">
          <div className="w-full">
            <div className="p-4 rounded-xl">
              {/* Responsive grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <GlobalImpactCard
                  icon={Users}
                  end={50000}
                  label="Active Learners"
                  color="text-blue-500"
                />
                <GlobalImpactCard
                  icon={GraduationCap}
                  end={12500}
                  label="Courses Completed"
                  color="text-green-500"
                />
                <GlobalImpactCard
                  icon={Globe}
                  end={120}
                  label="Countries"
                  color="text-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualizationSection;
