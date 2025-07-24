import React from "react";
import { motion } from "framer-motion";
import profileImage from "../../assets/bannerbook/pro.jpg";
import Footer from "@/components/Footer";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <section
        id="about"
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 py-12 md:py-20 px-4 sm:px-6 lg:px-24 flex items-center justify-center"
      >
        <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 md:gap-12 items-center">
          {/* Image Content - Placed first on mobile */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center order-1 lg:order-2 w-full max-w-xs sm:max-w-sm md:max-w-md"
          >
            <div className="relative w-full">
              <div className="absolute -inset-3 sm:-inset-4 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-600 opacity-20 blur-lg"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src={profileImage}
                  alt="Professional Developer"
                  className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white dark:bg-slate-800 px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
                <span className="font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                  Emmrex
                </span>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Full Stack Developer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text Content - Placed second on mobile */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 space-y-6 md:space-y-8 text-gray-800 dark:text-gray-200 order-2 lg:order-1"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4 md:mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 md:after:w-24 after:h-1 after:bg-blue-500 after:rounded-full"
            >
              About Me
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg leading-relaxed"
            >
              I'm a passionate{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                Full Stack Developer
              </strong>{" "}
              specializing in robust web applications using{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                MongoDB, Express.js, React.js, Node.js, Nest.js, Vue.js, and SQL
              </strong>
              . I hold a{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                B.Tech in Civil Engineering
              </strong>{" "}
              from Ladoke Akintola University of Technology (LAUTECH) and
              further developed my software skills at{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                SQI College of ICT
              </strong>
              .
            </motion.p>

            <motion.div variants={itemVariants}>
              <p className="text-base md:text-lg mb-3 md:mb-4">
                I specialize in creating efficient, scalable solutions with
                exceptional user experiences:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-1 md:mt-2">
                {[
                  "Real-time apps with Socket.io",
                  "Secure auth with JWT/OAuth",
                  "Email services via Nodemailer",
                  "Responsive UI/UX design",
                  "RESTful API development",
                  "Database architecture",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-2 text-sm md:text-base"
                  >
                    <span className="text-blue-500 mt-1">▹</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-base md:text-lg mb-3">
                Notable deployed projects:
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  "E-Commerce Platform",
                  "CMS",
                  "Bookstore App",
                  "Blog Platform",
                  "Chat Application",
                  "Admin Dashboard",
                ].map((project, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 md:px-4 md:py-2 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-full text-xs md:text-sm font-medium shadow-sm"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg leading-relaxed"
            >
              Continuously expanding my skills in{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                Data Structures & Algorithms
              </strong>
              , exploring{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                fintech systems
              </strong>
              , and refining{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                UI/UX principles
              </strong>
              . I thrive in collaborative environments and welcome new technical
              challenges.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ✅ Properly included Footer */}
      <Footer />
    </>
  );
};

export default About;
