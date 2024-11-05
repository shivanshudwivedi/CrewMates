# Web Development Project 7 - *Crewmate Manager*

Submitted by: **Shivanshu Dwivedi**

This web app: **A comprehensive crew management system that allows users to create, update, delete, and view team members with different roles, specialties, and experience levels. The app includes features like filtering, sorting, statistics, and data import/export capabilities.**

Time spent: **12** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **A create form allows users to add new cremates**
- [x] **Users can name the crewmate and set the crewmate's attributes by clicking on one of several values**
  - [x] Users can set role (Engineer, Designer, Manager)
  - [x] Users can set specialty (Frontend, Backend, Full Stack, UI/UX)
  - [x] Users can set experience level (Junior, Mid-Level, Senior)
- [x] **The site displays a summary page of all the user's added crewmates**
- [x] **A previously created crewmate can be updated from the crewmate list**
- [x] **A previously created crewmate can be deleted from the crewmate list**
  - [x] Includes confirmation dialog for delete actions
- [x] **Each crewmate has a direct, unique link to an info page about them**

The following **optional** features are implemented:

- [x] A crewmate can be given a category upon creation which restricts their attributes
  - [x] Role selection influences available specialty options
- [x] The site displays summary statistics about a user's crew on their crew page 
  - [x] Shows total number of crewmates
  - [x] Displays role distribution
  - [x] Shows experience level breakdown
- [x] The site displays a custom "success" metric about a user's crew which changes the look of the crewmate list

The following **additional** features are implemented:

* [x] Advanced filtering system with multiple criteria
* [x] Search functionality for crewmate names
* [x] Pagination for better data management
* [x] Data import/export functionality
* [x] Loading states and error handling
* [x] Responsive design for mobile and desktop
* [x] Material UI components for a polished look
* [x] Success/error notifications using snackbars

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with ScreenToGif

## Notes

Describe any challenges encountered while building the app:

- Implementing proper state management for multiple filters
- Handling data synchronization with Supabase
- Managing complex form validations
- Implementing proper error handling for all edge cases
- Creating responsive design that works well on all screen sizes
- Setting up proper TypeScript types for all components
- Managing loading states and user feedback

## License

    Copyright [2024] [Your Name]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.