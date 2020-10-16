let courses = null;

$(function () {

    $('.pill').click(function () {
        switchTab($(this).attr('data-target'))
    });

    $("#add-course-button").click(function () {
        $("#add-course").toggle();
    });


    $("#save-course").click(function () {
        const course = {
            grade: $("#grade").val(),
            title: $("#title").val(),
            semester: $("#semester").val(),
        };
        saveCourseRequest(course)
            .then(function (saveCourseResponse) {
                console.log("Save Course response: ", saveCourseResponse);
                saveCourse(course);
            })
            .catch(function () {
                alert('Error saving course')
            });
    });


    $("#cancel-course").click(function () {
        resetSaveCourseForm();
    });


    loadUserInfo()
        .then(function (user) {
            displayUserInfo(user)
        })
        .catch(function () {
            alert('Error loading user info')
        });


    loadCourses()
        .then(function (coursesResponse) {
            console.log("Courses response: ", coursesResponse)
            courses = coursesResponse;
            displayCourses(courses);
            updateGpa();
        })
        .catch(function () {
            alert('Error loading user info')
        });


    function saveCourse(course) {
        courses.push(course);
        addCourseToTable(course);
        updateGpa();
        resetSaveCourseForm();
    }

});


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

function loadUserInfo() {
    return $.get(
        {
            url: 'https://wad20-lab7.herokuapp.com/user',
            success: function (response) {
                return response;
            },
            error: function () {
                alert('error')
            }
        }
    );
}

function saveCourseRequest(course) {
    return $.post(
        {
            url: 'https://wad20-lab7.herokuapp.com/courses/add',
            data: course,
            success: function (response) {
                return response;
            },
            error: function () {
                alert('error')
            }
        }
    );
}

function loadCourses() {
    return $.get(
        {
            url: 'https://wad20-lab7.herokuapp.com/courses',
            success: function (response) {
                return response;
            },
            error: function () {
                alert('error')
            }
        }
    );
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