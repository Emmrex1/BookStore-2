import React from 'react';
import { FaFacebookF, FaInstagram, FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16 text-gray-600 dark:text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center space-x-2">
              <img src="../../public/EmmrexCoder.png" alt="" />
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Marketing</a></li>
              <li><a href="#">Analytics</a></li>
              <li><a href="#">Automation</a></li>
              <li><a href="#">Commerce</a></li>
              <li><a href="#">Insights</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Submit ticket</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Guides</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Jobs</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">License</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
          </div>
          <form className="mt-4 md:mt-0 flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 Your Company, Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-gray-500 dark:text-gray-400 text-xl">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaGithub /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
