import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Intro from '@/components/Intro'
import Try from '@/components/try'
import Login from '@/components/Login'
import Register from '@/components/Register'
import SuperAdmin from '@/components/superAdmin/SuperAdmin'
import AdminProfile from '@/components/superAdmin/Profile'
import SchoolRequest from '@/components/superAdmin/SchoolRequest'
import Schools from '@/components/superAdmin/Schools'
import SchoolAdmin from '@/components/schoolAdmin/SchoolAdmin'
import Students from '@/components/schoolAdmin/Students'
import Teachers from '@/components/schoolAdmin/Teachers'
import Clubs from '@/components/schoolAdmin/Clubs'
import SchoolProfile from '@/components/schoolAdmin/Profile'
import Teacher from '@/components/teacher/Teacher'
import Sections from '@/components/teacher/Sections'
import Profile from '@/components/teacher/Profile'
import ClubAdmin from '@/components/clubs/ClubAdmin'
import ClubMembers from '@/components/clubs/Members'
import ClubProfile from '@/components/clubs/Profile'
import ClubRequests from '@/components/clubs/Requests'
import MainStudents from '@/components/students/Student'
import MyClassActivity from '@/components/students/MyClassActivity'
import MyClubActivity from '@/components/students/MyClubActivity'
import ClubsInSchool from '@/components/students/ClubsInSchool'
import StudentProfile from '@/components/students/Profile'
import StudentScore from '@/components/students/StudentScore'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/try',
      name: 'Try',
      component: Try
    },
    {
      path: '/',
      name: 'Intro',
      component: Intro
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/schoolReg',
      name: 'Register',
      component: Register
    },
    {
      path: '/score/:student_id',
      name: 'StudentScore',
      component: StudentScore
    },
    {
      path: '/superAdmin',
      name: 'SuperAdmin',
      component: SuperAdmin,
      children: [
        {
          path:'/requests',
          component:SchoolRequest
        },
        {
          path:'/schools',
          component:Schools
        },
        {
          path:'/adminProfile',
          component:AdminProfile
        }
      ]
    },
    {
      path: '/schoolAdmin',
      name: 'SchoolAdmin',
      component: SchoolAdmin,
      children: [
        {
          path:'/students',
          component:Students
        },
        {
          path:'/teachers',
          component:Teachers
        },
        {
          path:'/clubs',
          component:Clubs
        },
        {
          path:'/schoolProfile',
          component: SchoolProfile
        }
      ]
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: Teacher,
      children: [
        {
          path:'/teacher/mysection',
          component:Sections
        },
        {
          path:'/teacher/profile',
          component:Profile
        }
      ]
    },
    {
      path: '/clubAdmin',
      name: 'ClubAdmin',
      component: ClubAdmin,
      children: [
        {
          path:'/clubRequests',
          component:ClubRequests
        },
        {
          path:'/clubMembers',
          component:ClubMembers
        },
        {
          path:'/clubProfile',
          component:ClubProfile
        }
      ]
    },
    {
      path: '/student/',
      name: 'Students',
      component: MainStudents,
      children: [
        {
          path:'/my_class_activity',
          component:MyClassActivity
        },
        {
          path:'/my_club_activity',
          component: MyClubActivity
        },
        {
          path:'/clubs_in_school',
          component:ClubsInSchool
        },
        {
          path:'/student_profile',
          component:StudentProfile
        }
      ]
    }
  ]
})
