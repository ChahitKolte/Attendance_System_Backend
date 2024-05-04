const Bootcamp = require('../models/bootcamp');
const Course = require('../models/course');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return res.status(404).json({ success: false, message: 'Bootcamp not found' });
    }
    res.status(200).json({ success: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const { name, rollnumber, courseId } = req.body;
    const student = await Bootcamp.findOne({ rollnumber });

    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const course = student.courses.find(course => String(course._id) === courseId);
    if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found for the student' });
    }

    try {
        course.attendance.push(String(Date.now()));
        await student.save();
        res.status(200).json({ success: true, message: 'Attendance Marked Successfully' });
    } catch (error) {
        console.error(`Error updating attendance: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error updating attendance' });
    }
});
//@ update the student details and also add the course to the student
exports.updateBootcampStudent = asyncHandler(async (req, res, next) => {
    const { rollnumber, newName, newCourseId } = req.body;
    console.log(req.body);
    try {
        // Find the student by roll number
        const student = await Bootcamp.findOne({ rollnumber });

        // If student is not found, return error
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Update student's name if provided
        if (newName) {
            student.name = newName;
        }

        // Update student's course list if provided
        if (newCourseId) {
            console.log(newCourseId)

            // Check if the student is already enrolled in the new course
            const existingCourse = student.courses.find(course => String(course._id) === String(newCourseId));
            if (existingCourse) {
                return res.status(400).json({ success: false, message: 'Student is already enrolled in this course' });
            }

            // Push the new course into the student's courses array
            student.courses.push({ _id: newCourseId, attendance: [] });

        }
        console.log(student.courses)
        // Save the updated student document
        await student.save();

        res.status(200).json({ success: true, message: 'Student details updated successfully', data: student });
    } catch (error) {
        console.error(`Error updating student details: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error updating student details' });
    }
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return res.status(404).json({ success: false, message: 'Bootcamp not found' });
    }
    res.status(200).json({ success: true, data: {} });
});
exports.getStudentsInCourse = asyncHandler(async (req, res, next) => {
    const courseId = req.params.id;

    console.log(courseId);
    try {
        const students = await Bootcamp.find({ 'courses._id': courseId });
        if (!students || students.length === 0) {
            return res.status(404).json({ success: true, message: 'No students found for the course' });
        }

        const data = students.map(student => {
            const course = student.courses.find(course => String(course._id) === courseId);
            return {
                name: student.name,
                rollnumber: student.rollnumber,
                attendance: course.attendance
            }
        });
        console.log(data);
        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error(`Error retrieving students: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error retrieving students' });
    }
});