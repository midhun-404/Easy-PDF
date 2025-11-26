import React from 'react';
import { HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "Is EasyPDF completely free?",
        answer: "Yes! EasyPDF is 100% free to use for all your document needs. There are no hidden fees or premium subscriptions required."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. All file processing happens locally in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security."
    },
    {
        question: "Can I use EasyPDF on mobile devices?",
        answer: "Yes, EasyPDF is fully responsive and works seamlessly on smartphones and tablets, allowing you to convert files on the go."
    },
    {
        question: "What file formats do you support?",
        answer: "We support a wide range of formats including PDF, Word (DOCX), and various image formats (PNG, JPG, WEBP) for conversion and manipulation."
    },
    {
        question: "Do I need to install any software?",
        answer: "No installation is required. EasyPDF runs entirely in your web browser, so you can use it instantly without downloading any additional software."
    },
    {
        question: "Is there a limit on file size?",
        answer: "Since processing is done locally, performance depends on your device. We recommend files under 50MB for the best experience, but there is no hard limit enforced by us."
    }
];

const FAQSection: React.FC = () => {
    return (
        <section id="faq" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <HelpCircle className="w-8 h-8 text-cyan-400" />
                    Frequently Asked Questions
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Got questions? We've got answers. Here's everything you need to know about EasyPDF.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] group"
                    >
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                            {faq.question}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
