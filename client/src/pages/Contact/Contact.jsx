// src/components/ContactForm.js
import React, { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    subject: "",
    projectType: "",
    description: "",
    email: "",
    timeline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your submission! We will contact you shortly.");
    setFormData({
      fullName: "",
      subject: "",
      projectType: "",
      description: "",
      email: "",
      timeline: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="md:flex">
        {/* Left Panel - Contact Info */}
        <div className="md:w-2/5 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8 pb-4 relative after:absolute after:left-0 after:bottom-0 after:h-1 after:w-16 after:bg-green-500">
            Get in Touch
          </h1>

          <div className="space-y-6">
            <ContactInfoItem
              icon={<EnvelopeIcon className="w-6 h-6 text-green-400" />}
              title="Email"
              content={
                <a
                  href="mailto:hello@glavenga.de"
                  className="text-green-400 hover:underline"
                >
                  hello@glavenga.de
                </a>
              }
              description="Send me an email..."
            />

            <ContactInfoItem
              icon={<PhoneIcon className="w-6 h-6 text-green-400" />}
              title="Phone"
              content="+234 (0) 123 456 7890"
              description="Call me directly"
            />

            <ContactInfoItem
              icon={<MapPinIcon className="w-6 h-6 text-green-400" />}
              title="Location"
              content="Lagos, Nigeria"
              description="Email: jt.lagos"
            />

            <div className="pt-4">
              <ContactInfoItem
                icon={<CalendarIcon className="w-6 h-6 text-green-400" />}
                title="Schedule"
                content={
                  <button className="mt-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all flex items-center">
                    Book a Meeting
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                }
                description="Let's discuss your project"
              />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Follow Me</h3>
            <div className="flex space-x-4">
              {["twitter", "facebook", "instagram", "linkedin", "dribbble"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition-all"
                  >
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  </a>
                )
              )}
            </div>
          </div>

          <div className="mt-10 bg-gray-800 rounded-xl p-5 text-center">
            <h3 className="text-xl font-bold">Outof Stats</h3>
            <p className="text-gray-400 mt-2">
              Project Success & Client Satisfaction
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="md:w-3/5 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 relative after:absolute after:left-0 after:bottom-0 after:h-1 after:w-16 after:bg-blue-500">
            Start Your Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full Name *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              type="text"
            />

            <FormField
              label="Subject *"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's your project about?"
              type="text"
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Project Type *
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select project type</option>
                <option value="website">Website Development</option>
                <option value="app">Mobile App Development</option>
                <option value="design">UI/UX Design</option>
                <option value="marketing">Digital Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell me about your project, goals, and any specific requirements..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40"
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                Describe your project in detail
              </p>
            </div>

            <FormField
              label="Email *"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@gmail.com"
              type="email"
            />

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Timeline *
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select timeline</option>
                <option value="urgent">Urgent (1-2 weeks)</option>
                <option value="standard">Standard (3-4 weeks)</option>
                <option value="flexible">Flexible (1-2 months)</option>
                <option value="long-term">Long Term (3+ months)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all shadow-lg"
            >
              Start Your Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactInfoItem = ({ icon, title, content, description }) => (
  <div>
    <div className="flex items-center">
      <div className="mr-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="ml-9 mt-2">
      <p className="font-medium">{content}</p>
      <p className="text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

const FormField = ({ label, placeholder, type, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />
  </div>
);

export default ContactForm;
