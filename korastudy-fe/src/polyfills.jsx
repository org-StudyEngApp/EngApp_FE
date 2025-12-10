// Polyfill cho global, process và các biến môi trường Node.js khác
window.global = window;
window.process = window.process || {};
window.process.env = window.process.env || {};