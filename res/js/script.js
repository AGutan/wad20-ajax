let courses = null;

$(function () {
    $('.pill').click(function () {
        switchTab($(this).attr('data-target'))
    });

    $("#add-course-button").click(function () {
        $("#add-course").toggle();
    });

    // notice async keyword here
    $("#save-course").click(async function () {
        const course = {
            grade: $("#grade").val(),
            title: $("#title").val(),
            semester: $("#semester").val(),
        };
        // use await to wait for an async function to complete
        const updatedCourses = await saveCourseRequest(course)
        console.log("Save Course response: ", updatedCourses);
        saveCourse(course);
    });


    $("#cancel-course").click(function () {
        resetSaveCourseForm();
    });
});

// await keyword works only within async functions,
// an anonymous async function is used here that is also invoked immediately
(async () => {
    const user = await loadUserInfo()
    displayUserInfo(user)

    courses = await loadCourses()
    console.log("Courses: ", courses)
    displayCourses(courses);
    updateGpa();
})();

// async keyword to mark a function as asynchronous
async function loadUserInfo() {
    const userResponse = await fetch('https://wad20-lab7.herokuapp.com/user');
    return await userResponse.json();
}

async function saveCourseRequest(course) {
    const saveCourseResponse = await fetch('https://wad20-lab7.herokuapp.com/courses/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
    });
    return await saveCourseResponse.json();
}

async function loadCourses() {
    const coursesResponse = await fetch('https://wad20-lab7.herokuapp.com/courses');
    return await coursesResponse.json();
}

function saveCourse(course) {
    courses.push(course);
    addCourseToTable(course);
    updateGpa();
    resetSaveCourseForm();
}

function updateGpa() {
    const gpa = calculateGpa();
    $("#gpa strong").text(gpa);
}

function calculateGpa() {
    let points = 0;
    for (let course of courses) {
        if (course.grade > 90) {
            points = points + 4;
        } else if (course.grade > 80) {
            points = points + 3
        } else if (course.grade > 70) {
            points = points + 2
        } else if (course.grade > 60) {
            points = points + 1
        } else if (course.grade > 50) {
            points = points + 0.5
        }
    }
    return points / courses.length;
}


function addCourseToTable(course) {
    $('#courses tbody').append(`
        <tr>
            <td>${courses.length}</td>
            <td>${course.title}</td>
            <td>${course.semester}</td>
            <td>${course.grade}</td>
        </tr>
    `);
}


function resetSaveCourseForm() {
    $("#title").val("");
    $("#semester").val("");
    $("#grade").val("");
    $("#add-course").toggle();
}

function displayUserInfo(user) {
    $('#profile #name').text(user.firstname + " " + user.lastname);
    $('#profile #birthdate').text(user.birthdate);
    $('#profile #faculty').text(user.faculty);
}

function displayCourses(courses) {
    for (let i = 0; i < courses.length; i++) {
        $('#courses tbody').append(`
            <tr>
                <td>${i + 1}</td>
                <td>${courses[i].title}</td>
                <td>${courses[i].semester}</td>
                <td>${courses[i].grade}</td>
            </tr>
        `);
    }
}

function switchTab(id) {
    $('.tab').each(function () {
        if ($(this).attr('id') === id) {
            $(this).addClass('active')
        } else {
            $(this).removeClass('active')
        }
    });
    $('.pill').each(function () {
        if ($(this).attr('data-target') === id) {
            $(this).addClass('active')
        } else {
            $(this).removeClass('active')
        }
    });
}