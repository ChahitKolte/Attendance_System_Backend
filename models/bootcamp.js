const mongoose = require('mongoose');
const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    rollnumber: {
        type: String,
        required: [true, 'Please add a roll number'],
        unique: true,
        trim: true
    },
    courses: [{
        courseId: { type: mongoose.Schema.Types.Number, ref: "Course" },
        attendance: [{
            type: String,
        }]

    }]

}, timestamp = true);
// BootcampSchema.pre('save', function (next) {
//     this.courses.forEach(course => {
//         if (!course.attendance || course.attendance.length === 0) {
//             // If attendance array is empty or not defined, initialize it with default value
//             course.attendance = ["absent"];
//         }
//     });
//     next();
// });
module.exports = mongoose.model('Bootcamp', BootcampSchema);   
