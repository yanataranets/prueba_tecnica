const {jsPDF} = require("jspdf"); //load node v

const doc = new jsPDF();
doc.text("hello world", 10, 10);
doc.save("report"); //will save file in the current workingg directory


