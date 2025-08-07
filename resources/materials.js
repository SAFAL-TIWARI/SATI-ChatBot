// Resources Data Structure
const resourcesData = {
    notes: [
        {
            id: 'ada-handwritten',
            title: 'ADA Handwritten Notes',
            description: 'Complete handwritten notes for Analysis and Design of Algorithms',
            previewUrl: 'https://drive.google.com/file/d/1ljmregSZP2pQoTBAr-KsFgVIUomw50LS/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1ljmregSZP2pQoTBAr-KsFgVIUomw50LS',
            subject: 'Analysis and Design of Algorithm - Notes'
        },
        {
            id: 'ada-notes-sati',
            title: 'ADA Notes By SATI',
            description: 'Analysis and Design of Algorithms notes by SATI faculty',
            previewUrl: 'https://drive.google.com/file/d/1nl0AmLPdX8ItnEqgfYQDR4ocEgmWRQyE/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1nl0AmLPdX8ItnEqgfYQDR4ocEgmWRQyE',
            subject: 'Analysis and Design of Algorithm - Notes'
        },
        {
            id: 'cso-handwritten',
            title: 'CSO Handwritten Notes',
            description: 'Handwritten notes for Computer System Organization',
            previewUrl: 'https://drive.google.com/file/d/1ezPqkIMrOEKeBmRD27RDaa9qB--lCuqA/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1ezPqkIMrOEKeBmRD27RDaa9qB--lCuqA',
            subject: 'Computer System Organization - Notes'
        },
        {
            id: 'cso-notes-sati',
            title: 'CSO Notes By SATI',
            description: 'Computer System Organization notes prepared by SATI faculty',
            previewUrl: 'https://drive.google.com/file/d/1WtKh5Vj1Trk5RO_oLbm06MW2-A6GjBpT/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1WtKh5Vj1Trk5RO_oLbm06MW2-A6GjBpT',
            subject: 'Computer System Organization - Notes'
        },
        {
            id: 'cso-notes-rgpv',
            title: 'CSO Notes SATI RGPV',
            description: 'Computer System Organization notes as per RGPV syllabus',
            previewUrl: 'https://drive.google.com/file/d/1yWepsX-tuouTkQW_lUnR4JsvMZX4OMLt/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1yWepsX-tuouTkQW_lUnR4JsvMZX4OMLt',
            subject: 'Computer System Organization - Notes'
        },
        {
            id: 'mab-204-notes-unit-1-4',
            title: 'MAB 204 Notes Unit 1-4',
            description: 'MAB 204 notes from unit 1-4',
            previewUrl: 'https://drive.google.com/file/d/1MWTChdXKEvFapitfDcqyXCW77D5LVDYS/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1MWTChdXKEvFapitfDcqyXCW77D5LVDYS',
            subject: 'MAB 204 - Discrete Mathematics - Notes'
        },
        {
            id: 'mab-204-notes-unit-1-4-2',
            title: 'MAB 204 Notes Unit 1-4 (2)',
            description: 'MAB 204 notes from unit 1-4 (alternative version)',
            previewUrl: 'https://drive.google.com/file/d/1oDRX2YCsOR07hULYhgCHwxb-TVe0cb6l/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1oDRX2YCsOR07hULYhgCHwxb-TVe0cb6l',
            subject: 'MAB 204 - Discrete Mathematics - Notes'
        },
        {
            id: 'mab-204-notes-unit-5',
            title: 'MAB 204 Notes Unit 5',
            description: 'MAB 204 Notes unit 5',
            previewUrl: 'https://drive.google.com/file/d/1_RhT5EYvY5WdHJvsmViimSAKW6fUh3oM/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1_RhT5EYvY5WdHJvsmViimSAKW6fUh3oM',
            subject: 'MAB 204 - Discrete Mathematics - Notes'
        },
        {
            id: 'oop-notes',
            title: 'OOP Notes',
            description: 'Object-Oriented Programming comprehensive notes',
            previewUrl: 'https://drive.google.com/file/d/1Pl4FPS4pc4WAFFFSID_vD_P8x_ezaq0l/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1Pl4FPS4pc4WAFFFSID_vD_P8x_ezaq0l',
            subject: 'Object-Oriented Programming - Notes'
        },
        {
            id: 'oop-notes-rgpv',
            title: 'OOP Notes By RGPV',
            description: 'Object-Oriented Programming notes as per RGPV syllabus',
            previewUrl: 'https://drive.google.com/file/d/1x-0YZzObE3I4MAUdzgn9N4UbHxD2P4ol/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1x-0YZzObE3I4MAUdzgn9N4UbHxD2P4ol',
            subject: 'Object-Oriented Programming - Notes'
        },
        {
            id: 'os-notes-unit-1-2-3',
            title: 'OS Notes Unit 1,2,3',
            description: 'Operating System notes covering units 1, 2, and 3',
            previewUrl: 'https://drive.google.com/file/d/1ROeOawTiBxfy4LZYUi8r_Slutn6-UE9Y/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1ROeOawTiBxfy4LZYUi8r_Slutn6-UE9Y',
            subject: 'Operating System - Notes'
        },
        {
            id: 'react-cheatsheet',
            title: 'React CheatSheet',
            description: 'Comprehensive React CheatSheet for quick reference',
            previewUrl: 'https://drive.google.com/file/d/1a-VaxWJCNtq1uvfsjUSYQT3CyT8Y3hmC/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1a-VaxWJCNtq1uvfsjUSYQT3CyT8Y3hmC',
            subject: 'React - CheatSheet'
        },
        {
            id: 'http-headers-web-requests',
            title: 'HTTP Headers Web Requests And Responses',
            description: 'Complete guide to HTTP headers, web requests and responses',
            previewUrl: 'https://drive.google.com/file/d/1Wku-9wwXjXRCRxzEYSyUa-K73eJBeVHs/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1Wku-9wwXjXRCRxzEYSyUa-K73eJBeVHs',
            subject: 'Web Development - HTTP Headers'
        },
        {
            id: 'it-302-notes',
            title: 'IT 302 Notes',
            description: 'Comprehensive notes for Communication Skills',
            previewUrl: 'https://drive.google.com/file/d/1YIWS4tUFJm7Om0RhpVkfSAiX0ttWoNv4/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1YIWS4tUFJm7Om0RhpVkfSAiX0ttWoNv4',
            subject: 'IT 302 - Notes'
        },
        {
            id: 'java-book',
            title: 'JAVA Book',
            description: 'Complete JAVA programming book for comprehensive learning',
            previewUrl: 'https://drive.google.com/file/d/12OczJGzjJOQtY0BvS1mCIcC6SMmZ0sRc/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=12OczJGzjJOQtY0BvS1mCIcC6SMmZ0sRc',
            subject: 'JAVA Programming - Book'
        }
    ],
    practical: [
        {
            id: 'ada-2024-solution',
            title: 'ADA 2024 Solution',
            description: 'Complete solution for Analysis and Design of Algorithms 2024 practical',
            previewUrl: 'https://drive.google.com/file/d/1_Fbw4Pj-haLeGmFibfB_as3ohUlYASIy/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1_Fbw4Pj-haLeGmFibfB_as3ohUlYASIy',
            subject: 'Analysis and Design of Algorithm - Practical Assignment Solution'
        },
        {
            id: 'ada-2024',
            title: 'ADA 2024',
            description: 'Analysis and Design of Algorithms 2024 practical assignments',
            previewUrl: 'https://drive.google.com/file/d/1T483bx1uFkABhVrLxaBruEfTa28YhVR0/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1T483bx1uFkABhVrLxaBruEfTa28YhVR0',
            subject: 'Analysis and Design of Algorithm - Practical Assignment'
        },
        {
            id: 'mab-204-assignment',
            title: 'MAB 204 Assignment',
            description: 'MAB 204 assignment',
            previewUrl: 'https://drive.google.com/file/d/1bWWLxkxH5nIVsVvafLrDpjuxby3PSFcW/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1bWWLxkxH5nIVsVvafLrDpjuxby3PSFcW',
            subject: 'MAB 204 - Discrete Mathematics - Practical Assignment'
        },
        {
            id: 'oop-theory-assignment',
            title: 'OOP Theory Assignment',
            description: 'Object-Oriented Programming theory assignment',
            previewUrl: 'https://drive.google.com/file/d/19bwqXMWhwlE1CPF4mh-fShdAhC8tCeep/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=19bwqXMWhwlE1CPF4mh-fShdAhC8tCeep',
            subject: 'Object-Oriented Programming - Theory Assignment'
        },
        {
            id: 'oop-theory-assignment-solution',
            title: 'OOP Theory Assignment Solution',
            description: 'Object-Oriented Programming theory assignment solution',
            previewUrl: 'https://drive.google.com/file/d/14APjMfcNdyR80_ALU484DMisNmk2xyJG/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=14APjMfcNdyR80_ALU484DMisNmk2xyJG',
            subject: 'Object-Oriented Programming - Theory Assignment Solution'
        },
        {
            id: 'oop-practical-assignment-solution',
            title: 'OOP Practical Assignment Solution',
            description: 'Object-Oriented Programming practical assignment solution',
            previewUrl: 'https://drive.google.com/file/d/11dim2BeG0Q3FtZ1ZbQU3uhTamVQIAEor/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=11dim2BeG0Q3FtZ1ZbQU3uhTamVQIAEor',
            subject: 'Object-Oriented Programming - Practical Assignment Solution'
        },
        {
            id: 'oop-lab-assignment',
            title: 'OOP Lab Assignment',
            description: 'Object-Oriented Programming lab assignment',
            previewUrl: 'https://drive.google.com/file/d/1W_kb0-lWgZg1hsZg7AaaggUeZ3LVCj7W/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1W_kb0-lWgZg1hsZg7AaaggUeZ3LVCj7W',
            subject: 'Object-Oriented Programming - Lab Assignment'
        },
        {
            id: 'oop-lab-assignment-solution',
            title: 'OOP Lab Assignment Solution',
            description: 'Object-Oriented Programming lab assignment solution',
            previewUrl: 'https://drive.google.com/file/d/1B8XlkQ1G834q8QU4elqSoXy7gispSx4e/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1B8XlkQ1G834q8QU4elqSoXy7gispSx4e',
            subject: 'Object-Oriented Programming - Lab Assignment Solution'
        },
        {
            id: 'os-assignment',
            title: 'OS Assignment',
            description: 'Operating System assignment',
            previewUrl: 'https://drive.google.com/file/d/1l-RCsILnOx49ElNMG2QGR2OdpwITezR3/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1l-RCsILnOx49ElNMG2QGR2OdpwITezR3',
            subject: 'Operating System - Assignment'
        },
        {
            id: 'os-assignment-solution',
            title: 'OS Assignment Solution',
            description: 'Operating System assignment solution',
            previewUrl: 'https://drive.google.com/file/d/1C16AsBuGxTrYRtWFBmHJh1svXTrc5J1m/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1C16AsBuGxTrYRtWFBmHJh1svXTrc5J1m',
            subject: 'Operating System - Assignment Solution'
        }
    ],
    'test-papers': [
        {
            id: 'test-paper-2023',
            title: 'Test Paper 2023',
            description: 'Internal test paper for year 2023',
            previewUrl: 'https://drive.google.com/file/d/1a9kbFf8FQwvyHVLWUh_gXWvrGpmwmxv-/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1a9kbFf8FQwvyHVLWUh_gXWvrGpmwmxv-',
            subject: 'Test Paper 2023'
        },
        {
            id: 'os-objective-type',
            title: 'OS Objective Type',
            description: 'Operating System objective type questions',
            previewUrl: 'https://drive.google.com/file/d/1j6IFGhpdlMXePDV4_v_k5e3RS7fu-8nG/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1j6IFGhpdlMXePDV4_v_k5e3RS7fu-8nG',
            subject: 'Operating System - Objective Type Questions'
        },
        {
            id: '100-backfront-end-interviews',
            title: '100 BackFront End Interviews',
            description: '100 comprehensive backend and frontend interview questions and answers',
            previewUrl: 'https://drive.google.com/file/d/1pGiWTKjJtVDpilXdoR5GYY5DqBQVlzfi/preview',
            downloadUrl: 'https://drive.google.com/uc?export=download&id=1pGiWTKjJtVDpilXdoR5GYY5DqBQVlzfi',
            subject: 'Interview Preparation - Backend & Frontend'
        }
    ],
    syllabus: {
        cse: [
            {
                id: 'cs-302-syllabus',
                title: 'CS 302 Syllabus',
                description: 'Analysis and Design of Algorithms syllabus',
                previewUrl: 'https://drive.google.com/file/d/1A5yza8nDhgvky8yxiNuXu2MjQpRW2Edv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1A5yza8nDhgvky8yxiNuXu2MjQpRW2Edv',
                subject: 'CS 302 - Analysis and Design of Algorithms Syllabus'
            },
            {
                id: 'cs-303-syllabus',
                title: 'CS 303 Syllabus',
                description: 'Object Oriented Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/10C7D1ydusGN7EW9N8HPQg3-lNojYYfVi/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=10C7D1ydusGN7EW9N8HPQg3-lNojYYfVi',
                subject: 'CS 303 - Object Oriented Programming Syllabus'
            },
            {
                id: 'cs-304-syllabus',
                title: 'CS 304 Syllabus',
                description: 'Operating System syllabus',
                previewUrl: 'https://drive.google.com/file/d/1SPz-DoCRG9m3YToO1oR0coQNnGdnJgeZ/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1SPz-DoCRG9m3YToO1oR0coQNnGdnJgeZ',
                subject: 'CS 304 - Operating System Syllabus'
            },
            {
                id: 'cs-306-syllabus',
                title: 'CS 306 Syllabus',
                description: 'Internet Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1P-ecTAeuHZpvbp-8rrRh5M3hpPWpCxBd/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1P-ecTAeuHZpvbp-8rrRh5M3hpPWpCxBd',
                subject: 'CS 306 - Internet Programming Syllabus'
            },
            {
                id: 'mab-204-syllabus-cse',
                title: 'MAB 204 Syllabus',
                description: 'Discrete Mathematics syllabus',
                previewUrl: 'https://drive.google.com/file/d/16vkeopLfKrhszANP5GjVd8yN-00Vw8zD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=16vkeopLfKrhszANP5GjVd8yN-00Vw8zD',
                subject: 'MAB 204 - Discrete Mathematics Syllabus'
            },
            {
                id: 'oe-305-syllabus-cse',
                title: 'OE 305 Syllabus',
                description: 'Computer System Organization syllabus',
                previewUrl: 'https://drive.google.com/file/d/1Ji8zK_lkzpF4jv4nh3OeISI58YcOOlPR/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1Ji8zK_lkzpF4jv4nh3OeISI58YcOOlPR',
                subject: 'OE 305 - Computer System Organization Syllabus'
            }
        ],
        ec: [
            {
                id: 'ec-301-syllabus',
                title: 'EC 301 Syllabus',
                description: 'Electro Magnetic Theory syllabus',
                previewUrl: 'https://drive.google.com/file/d/1Y4sglxNuTcN1AmKIi8wO2TE7IZlb1bQZ/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1Y4sglxNuTcN1AmKIi8wO2TE7IZlb1bQZ',
                subject: 'EC 301 - Electro Magnetic Theory Syllabus'
            },
            {
                id: 'ec-302-syllabus',
                title: 'EC 302 Syllabus',
                description: 'Electronic Devices and Circuits syllabus',
                previewUrl: 'https://drive.google.com/file/d/1257oPpfJeD10L9ytGFyl8X-blTfEVuXt/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1257oPpfJeD10L9ytGFyl8X-blTfEVuXt',
                subject: 'EC 302 - Electronic Devices and Circuits Syllabus'
            },
            {
                id: 'ec-303-syllabus',
                title: 'EC 303 Syllabus',
                description: 'Network Analysis syllabus',
                previewUrl: 'https://drive.google.com/file/d/1FhN_NrzcbeYNA8siqdFFEwJW1sRoNJHS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1FhN_NrzcbeYNA8siqdFFEwJW1sRoNJHS',
                subject: 'EC 303 - Network Analysis Syllabus'
            },
            {
                id: 'ec-304-syllabus',
                title: 'EC 304 Syllabus',
                description: 'Signals and Systems syllabus',
                previewUrl: 'https://drive.google.com/file/d/1qCXurkFSOAp4981imX2QZMQOw0nlB_6U/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1qCXurkFSOAp4981imX2QZMQOw0nlB_6U',
                subject: 'EC 304 - Signals and Systems Syllabus'
            },
            {
                id: 'ec-305-syllabus',
                title: 'EC 305 Syllabus',
                description: 'Analog Communication syllabus',
                previewUrl: 'https://drive.google.com/file/d/1-roTbwq1GBO_lGWbypnmC7j7OwYlk5r_/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1-roTbwq1GBO_lGWbypnmC7j7OwYlk5r_',
                subject: 'EC 305 - Analog Communication Syllabus'
            }
        ],
        me: [
            {
                id: 'me-301-syllabus',
                title: 'ME 301 Syllabus',
                description: 'Fundamental of Thermodynamics syllabus',
                previewUrl: 'https://drive.google.com/file/d/1ZOZX95D6zo430zNTsRjW3J25DMCuXGI8/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1ZOZX95D6zo430zNTsRjW3J25DMCuXGI8',
                subject: 'ME 301 - Fundamental of Thermodynamics Syllabus'
            },
            {
                id: 'me-302-syllabus',
                title: 'ME 302 Syllabus',
                description: 'Strength and Mechanics of Material syllabus',
                previewUrl: 'https://drive.google.com/file/d/1TfA_WDI9_5yhn_Fbdp1yDD259fbi4jb2/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1TfA_WDI9_5yhn_Fbdp1yDD259fbi4jb2',
                subject: 'ME 302 - Strength and Mechanics of Material Syllabus'
            },
            {
                id: 'me-303-syllabus',
                title: 'ME 303 Syllabus',
                description: 'Theory of Machine-I syllabus',
                previewUrl: 'https://drive.google.com/file/d/1nnT40scCqSXay8zBq3t34PcaWVWQDe6y/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1nnT40scCqSXay8zBq3t34PcaWVWQDe6y',
                subject: 'ME 303 - Theory of Machine-I Syllabus'
            },
            {
                id: 'me-304-syllabus',
                title: 'ME 304 Syllabus',
                description: 'Materials Science syllabus',
                previewUrl: 'https://drive.google.com/file/d/1L8s8MXRaPujShE4yaAgqhCmDpaVkAU0y/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1L8s8MXRaPujShE4yaAgqhCmDpaVkAU0y',
                subject: 'ME 304 - Materials Science Syllabus'
            },
            {
                id: 'me-305-syllabus',
                title: 'ME 305 Syllabus',
                description: 'Introduction to Quality Management syllabus',
                previewUrl: 'https://drive.google.com/file/d/1sH0F4_JFFJ4muoCOtZeflTC0o_U0utdu/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1sH0F4_JFFJ4muoCOtZeflTC0o_U0utdu',
                subject: 'ME 305 - Introduction to Quality Management Syllabus'
            }
        ],
        ee: [
            {
                id: 'ee-301-syllabus',
                title: 'EE 301 Syllabus',
                description: 'Electro Mechanical Energy Conversion-I syllabus',
                previewUrl: 'https://drive.google.com/file/d/1JRKwkAb0WQ16nmKkHrfmilsxSkT8Vlcf/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1JRKwkAb0WQ16nmKkHrfmilsxSkT8Vlcf',
                subject: 'EE 301 - Electro Mechanical Energy Conversion-I Syllabus'
            },
            {
                id: 'ee-302-syllabus',
                title: 'EE 302 Syllabus',
                description: 'Electronic-II syllabus',
                previewUrl: 'https://drive.google.com/file/d/1oYPgHKEro4-KcZJyaDKL_wFS9IBIzPAt/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1oYPgHKEro4-KcZJyaDKL_wFS9IBIzPAt',
                subject: 'EE 302 - Electronic-II Syllabus'
            },
            {
                id: 'ee-303-syllabus',
                title: 'EE 303 Syllabus',
                description: 'Network Analysis syllabus',
                previewUrl: 'https://drive.google.com/file/d/1qnfor6QSEilIA1FCUEfK_i-Qty2QsYpZ/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1qnfor6QSEilIA1FCUEfK_i-Qty2QsYpZ',
                subject: 'EE 303 - Network Analysis Syllabus'
            },
            {
                id: 'ee-304-syllabus',
                title: 'EE 304 Syllabus',
                description: 'Electrical Instrumentation syllabus',
                previewUrl: 'https://drive.google.com/file/d/1Ci6cogW56XiuM9qi1f0R3pgCACoyD5WW/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1Ci6cogW56XiuM9qi1f0R3pgCACoyD5WW',
                subject: 'EE 304 - Electrical Instrumentation Syllabus'
            },
            {
                id: 'ee-305-syllabus',
                title: 'EE 305 Syllabus',
                description: 'Signals and Systems syllabus',
                previewUrl: 'https://drive.google.com/file/d/1zgPbfQ-4Xwnt-oRPTURJNdDqdQz83gh_/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1zgPbfQ-4Xwnt-oRPTURJNdDqdQz83gh_',
                subject: 'EE 305 - Signals and Systems Syllabus'
            },
            {
                id: 'ee-306-syllabus',
                title: 'EE 306 Syllabus',
                description: 'Lab - Testing Electrical Equipments syllabus',
                previewUrl: 'https://drive.google.com/file/d/17Cw5M7TKa0qY5FYHoRFYMjKc7Y1hDUiH/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=17Cw5M7TKa0qY5FYHoRFYMjKc7Y1hDUiH',
                subject: 'EE 306 - Lab - Testing Electrical Equipments Syllabus'
            },
            {
                id: 'ee-308-syllabus',
                title: 'EE 308 Syllabus',
                description: 'Energy Ecology Environment and Society syllabus',
                previewUrl: 'https://drive.google.com/file/d/1bghiRtlDxdjL-DW2tlvAKVYAXkesAcVD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1bghiRtlDxdjL-DW2tlvAKVYAXkesAcVD',
                subject: 'EE 308 - Energy Ecology Environment and Society Syllabus'
            },
            {
                id: 'hec-syllabus',
                title: 'HEC Syllabus',
                description: 'Introduction to Yoga for Well-being syllabus',
                previewUrl: 'https://drive.google.com/file/d/1SxDNeIih-FfNKpAlGvpVoKMXorO7uFGi/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1SxDNeIih-FfNKpAlGvpVoKMXorO7uFGi',
                subject: 'HEC - Introduction to Yoga for Well-being Syllabus'
            }
        ],
        ce: [
            {
                id: 'ce-301-syllabus',
                title: 'CE 301 Syllabus',
                description: 'Building Materials and Construction syllabus',
                previewUrl: 'https://drive.google.com/file/d/15ItRojOTAXvjefjs-pQqGAm6iWZR2V1a/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=15ItRojOTAXvjefjs-pQqGAm6iWZR2V1a',
                subject: 'CE 301 - Building Materials and Construction Syllabus'
            },
            {
                id: 'ce-302-syllabus',
                title: 'CE 302 Syllabus',
                description: 'Strength of Materials syllabus',
                previewUrl: 'https://drive.google.com/file/d/1C2QXmF4P8QdXAsgKH500yjAzb5Q-d21E/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C2QXmF4P8QdXAsgKH500yjAzb5Q-d21E',
                subject: 'CE 302 - Strength of Materials Syllabus'
            },
            {
                id: 'ce-303-syllabus',
                title: 'CE 303 Syllabus',
                description: 'Building Planning and Architecture syllabus',
                previewUrl: 'https://drive.google.com/file/d/1Qf062Afek9ZQNMA1fJmuqtkPtlB6dQ2p/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1Qf062Afek9ZQNMA1fJmuqtkPtlB6dQ2p',
                subject: 'CE 303 - Building Planning and Architecture Syllabus'
            },
            {
                id: 'ce-304-syllabus',
                title: 'CE 304 Syllabus',
                description: 'Surveying-I syllabus',
                previewUrl: 'https://drive.google.com/file/d/18Elp_4D4jN7GEOtm3zVW1FBBHuQj-C7D/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Elp_4D4jN7GEOtm3zVW1FBBHuQj-C7D',
                subject: 'CE 304 - Surveying-I Syllabus'
            },
            {
                id: 'ce-305-syllabus',
                title: 'CE 305 Syllabus',
                description: 'Computer Aided Drafting syllabus',
                previewUrl: 'https://drive.google.com/file/d/1WuboNTWfkFGBOmpVylmYEYI0sAY3NX9A/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1WuboNTWfkFGBOmpVylmYEYI0sAY3NX9A',
                subject: 'CE 305 - Computer Aided Drafting Syllabus'
            }
        ],
        iot: [
            {
                id: 'io-302-syllabus',
                title: 'IO 302 Syllabus',
                description: 'Analysis and Design of Algorithm syllabus',
                previewUrl: 'https://drive.google.com/file/d/1JlCF-5F11qRt_Q5Hb-bZ1MwWlUtMhYZF/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1JlCF-5F11qRt_Q5Hb-bZ1MwWlUtMhYZF',
                subject: 'IO 302 - Analysis and Design of Algorithm Syllabus'
            },
            {
                id: 'io-303-syllabus',
                title: 'IO 303 Syllabus',
                description: 'Object Oriented Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1auBpaRw8QQiRnqVlXrS5j-g5QVJxBgJT/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1auBpaRw8QQiRnqVlXrS5j-g5QVJxBgJT',
                subject: 'IO 303 - Object Oriented Programming Syllabus'
            },
            {
                id: 'io-304-syllabus',
                title: 'IO 304 Syllabus',
                description: 'Electronic Devices and Circuits syllabus',
                previewUrl: 'https://drive.google.com/file/d/1R0HTch1iBaC5dJtpQTdDz-NloVBeBAmY/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1R0HTch1iBaC5dJtpQTdDz-NloVBeBAmY',
                subject: 'IO 304 - Electronic Devices and Circuits Syllabus'
            },
            {
                id: 'io-306-syllabus',
                title: 'IO 306 Syllabus',
                description: 'Internet Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1mwA4zlGQ9PjxBeLnoNbfLwOxBZPjVIvM/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1mwA4zlGQ9PjxBeLnoNbfLwOxBZPjVIvM',
                subject: 'IO 306 - Internet Programming Syllabus'
            },
            {
                id: 'mab-204-syllabus-iot',
                title: 'MAB 204 Syllabus',
                description: 'Discrete Mathematics syllabus',
                previewUrl: 'https://drive.google.com/file/d/1QsAxuuPHiGV6FRRomxULPl1S90duF2nj/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QsAxuuPHiGV6FRRomxULPl1S90duF2nj',
                subject: 'MAB 204 - Discrete Mathematics Syllabus'
            },
            {
                id: 'oe-305-syllabus-iot',
                title: 'OE 305 Syllabus',
                description: 'Computer System Organization syllabus',
                previewUrl: 'https://drive.google.com/file/d/14mPvvAKNabu0wbKbYwEiiGljeIIZtjQL/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=14mPvvAKNabu0wbKbYwEiiGljeIIZtjQL',
                subject: 'OE 305 - Computer System Organization Syllabus'
            }
        ],
        it: [
            {
                id: 'it-302-syllabus',
                title: 'IT 302 Syllabus',
                description: 'Communication System syllabus',
                previewUrl: 'https://drive.google.com/file/d/1dlxhTdVAKyQqkkYZ8DIfLkmIEg6ze_qA/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1dlxhTdVAKyQqkkYZ8DIfLkmIEg6ze_qA',
                subject: 'IT 302 - Communication System Syllabus'
            },
            {
                id: 'it-303-syllabus',
                title: 'IT 303 Syllabus',
                description: 'Analysis and Design of Algorithm syllabus',
                previewUrl: 'https://drive.google.com/file/d/1a4RNfV1AZAIRmG8Yka4EsnzgxPGRCb7m/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1a4RNfV1AZAIRmG8Yka4EsnzgxPGRCb7m',
                subject: 'IT 303 - Analysis and Design of Algorithm Syllabus'
            },
            {
                id: 'it-304-syllabus',
                title: 'IT 304 Syllabus',
                description: 'Object Oriented Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1kwBkNcKM2rsqwx5MKPwv63tQQwub4Xbp/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1kwBkNcKM2rsqwx5MKPwv63tQQwub4Xbp',
                subject: 'IT 304 - Object Oriented Programming Syllabus'
            },
            {
                id: 'it-306-syllabus',
                title: 'IT 306 Syllabus',
                description: 'Internet Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1_5KnGx7pRiQwJ88ga2wJJQVka33k8phZ/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1_5KnGx7pRiQwJ88ga2wJJQVka33k8phZ',
                subject: 'IT 306 - Internet Programming Syllabus'
            },
            {
                id: 'mab-204-syllabus-it',
                title: 'MAB 204 Syllabus',
                description: 'Discrete Mathematics syllabus',
                previewUrl: 'https://drive.google.com/file/d/1Q4Td_s6RW_emY7ordPO-lNGvCL6lIhRy/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1Q4Td_s6RW_emY7ordPO-lNGvCL6lIhRy',
                subject: 'MAB 204 - Discrete Mathematics Syllabus'
            },
            {
                id: 'oe-305-syllabus-it',
                title: 'OE 305 Syllabus',
                description: 'Computer System Organization syllabus',
                previewUrl: 'https://drive.google.com/file/d/1p9HfQg0_okduOK6Y8MVvTQNy3H6ME2wG/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1p9HfQg0_okduOK6Y8MVvTQNy3H6ME2wG',
                subject: 'OE 305 - Computer System Organization Syllabus'
            }
        ],
        bct: [
            {
                id: 'bcc-202-syllabus',
                title: 'BCC 202 Syllabus',
                description: 'Analysis and Design of Algorithm syllabus',
                previewUrl: 'https://drive.google.com/file/d/16wGBixYcQLY1mmy-qE93Vjs0DLmJoLBN/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=16wGBixYcQLY1mmy-qE93Vjs0DLmJoLBN',
                subject: 'BCC 202 - Analysis and Design of Algorithm Syllabus'
            },
            {
                id: 'bcc-203-syllabus',
                title: 'BCC 203 Syllabus',
                description: 'Object Oriented Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1flvnGUW8YUTVeXo5hB9O_pf4V3_F_H6q/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1flvnGUW8YUTVeXo5hB9O_pf4V3_F_H6q',
                subject: 'BCC 203 - Object Oriented Programming Syllabus'
            },
            {
                id: 'bcc-204-syllabus',
                title: 'BCC 204 Syllabus',
                description: 'Operating System syllabus',
                previewUrl: 'https://drive.google.com/file/d/1gOnmqa9UPfJ4LleqalJApmMyOQ6hxcs9/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1gOnmqa9UPfJ4LleqalJApmMyOQ6hxcs9',
                subject: 'BCC 204 - Operating System Syllabus'
            },
            {
                id: 'bcl-206-syllabus',
                title: 'BCL 206 Syllabus',
                description: 'Internet Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1y7ZV1WR5YKFCedD8zmgRJjCSYrLroQog/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1y7ZV1WR5YKFCedD8zmgRJjCSYrLroQog',
                subject: 'BCL 206 - Internet Programming Syllabus'
            },
            {
                id: 'bco-205-syllabus',
                title: 'BCO 205 Syllabus',
                description: 'Computer System Organization syllabus',
                previewUrl: 'https://drive.google.com/file/d/11qUqBH8adxZciYxi_cgZpZUlfLBPrbOb/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=11qUqBH8adxZciYxi_cgZpZUlfLBPrbOb',
                subject: 'BCO 205 - Computer System Organization Syllabus'
            },
            {
                id: 'mab-204-syllabus-bct',
                title: 'MAB 204 Syllabus',
                description: 'Discrete Mathematics syllabus',
                previewUrl: 'https://drive.google.com/file/d/102Jp22y725q6v6BSeHjed2AjGgSMkRyY/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=102Jp22y725q6v6BSeHjed2AjGgSMkRyY',
                subject: 'MAB 204 - Discrete Mathematics Syllabus'
            }
        ],
        aiads: [
            {
                id: 'ai-302-syllabus',
                title: 'AI 302 Syllabus',
                description: 'Artificial Intelligence syllabus',
                previewUrl: 'https://drive.google.com/file/d/1L-cLEPKsmv0zugh1Nwm1YFDZHCyhGfjF/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1L-cLEPKsmv0zugh1Nwm1YFDZHCyhGfjF',
                subject: 'AI 302 - Artificial Intelligence Syllabus'
            },
            {
                id: 'ai-303-syllabus',
                title: 'AI 303 Syllabus',
                description: 'Object Oriented Programming syllabus',
                previewUrl: 'https://drive.google.com/file/d/1aEDlw92y4igEFuiLcwK7uqJIYbL28J5i/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1aEDlw92y4igEFuiLcwK7uqJIYbL28J5i',
                subject: 'AI 303 - Object Oriented Programming Syllabus'
            },
            {
                id: 'ai-304-syllabus',
                title: 'AI 304 Syllabus',
                description: 'Operating System syllabus',
                previewUrl: 'https://drive.google.com/file/d/1uIZn06BJ5YYRdjrlrGPRemJTQ_ZpsO4J/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1uIZn06BJ5YYRdjrlrGPRemJTQ_ZpsO4J',
                subject: 'AI 304 - Operating System Syllabus'
            },
            {
                id: 'ai-305-syllabus',
                title: 'AI 305 Syllabus',
                description: 'Computer System Organization syllabus',
                previewUrl: 'https://drive.google.com/file/d/1wR43yueymrKHqPUHc6IkQrE1ihlmQMT8/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1wR43yueymrKHqPUHc6IkQrE1ihlmQMT8',
                subject: 'AI 305 - Computer System Organization Syllabus'
            },
            {
                id: 'ai-306-syllabus',
                title: 'AI 306 Syllabus',
                description: 'Web Application Development syllabus',
                previewUrl: 'https://drive.google.com/file/d/1eSSUcfRuxN7XobU_cReBroED13J7Uh-Z/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eSSUcfRuxN7XobU_cReBroED13J7Uh-Z',
                subject: 'AI 306 - Web Application Development Syllabus'
            },
            {
                id: 'mab-204-syllabus-aiads',
                title: 'MAB 204 Syllabus',
                description: 'Discrete Mathematics syllabus',
                previewUrl: 'https://drive.google.com/file/d/1ac-160oiYuNPC2rz0M0cbvB6MsJFdejt/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1ac-160oiYuNPC2rz0M0cbvB6MsJFdejt',
                subject: 'MAB 204 - Discrete Mathematics Syllabus'
            }
        ],
        aiaml: [
            {
                id: 'aiaml-301-syllabus',
                title: 'AIAML 301 Syllabus',
                description: 'AI and Machine Learning Fundamentals syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'AIAML 301 - AI and Machine Learning Fundamentals Syllabus'
            }
        ]
    },
    pyqs: {
        cse: [
            {
                id: 'cs-302-bc-302-ai-302-io-302-may-2024',
                title: 'CS 302,BC 302,AI 302,IO 302 May (2024)',
                description: 'Analysis and Design of Algorithms May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1ttz4PCtnZ9r_dNhJKAyV11VTdf8w039B/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1ttz4PCtnZ9r_dNhJKAyV11VTdf8w039B',
                subject: 'CS 302,BC 302,AI 302,IO 302 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cs-302-bc-302-dec-2023',
                title: 'CS 302& BC 302 Dec (2023)',
                description: 'Analysis and Design of Algorithms December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1bGmm9NGwasdqFsKe_BP6wPN7AYllHkbB/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1bGmm9NGwasdqFsKe_BP6wPN7AYllHkbB',
                subject: 'CS 302& BC 302 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'cs-302-bc-302-may-2024',
                title: 'CS 302 & BC 302 May (2024)',
                description: 'Analysis and Design of Algorithms May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/11Hw0ZqVIc49meJDCAVCnxj8-W8sP9hwO/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=11Hw0ZqVIc49meJDCAVCnxj8-W8sP9hwO',
                subject: 'CS 302 & BC 302 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cs-302-bc-302-nov-2024',
                title: 'CS 302 & BC 302 Nov (2024)',
                description: 'Analysis and Design of Algorithms November 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/16KmQYNgW1YeV0z1imAgCqUYzIYydAUKk/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=16KmQYNgW1YeV0z1imAgCqUYzIYydAUKk',
                subject: 'CS 302 & BC 302 Nov (2024) - Previous Year Question Paper'
            },
            {
                id: 'bc-405-2023',
                title: 'BC 405 (2023)',
                description: 'BC 405 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1FAhOTqmwEHfmONVvWZK8QRE607RmlE8T/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1FAhOTqmwEHfmONVvWZK8QRE607RmlE8T',
                subject: 'BC 405 (2023) - Previous Year Question Paper'
            },
            {
                id: 'bc-405-2024',
                title: 'BC 405 (2024)',
                description: 'BC 405 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/17obXNv1vus58nI39nBpj20W3XXRIkJwo/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=17obXNv1vus58nI39nBpj20W3XXRIkJwo',
                subject: 'BC 405 (2024) - Previous Year Question Paper'
            },
            {
                id: 'bc-mab-204-may-2024',
                title: 'BC MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1kSv_MubWFHOxUxV2AkoDoNgwdfD6IJUt/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1kSv_MubWFHOxUxV2AkoDoNgwdfD6IJUt',
                subject: 'BC MAB 204 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-dec-2023',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cse-305-may-2023',
                title: 'CSE 305 May (2023)',
                description: 'CSE 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1LdALskK59MR5IssO8wid5RITRGRFn15w/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1LdALskK59MR5IssO8wid5RITRGRFn15w',
                subject: 'CSE 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'oe-305-bc-305-may-2024',
                title: 'OE 305 & BC 305 May (2024)',
                description: 'OE 305 & BC 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1amMspAnnSU0AzODTGlj15W09vnWh5UcF/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1amMspAnnSU0AzODTGlj15W09vnWh5UcF',
                subject: 'OE 305 & BC 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-2',
                title: 'All Branch MAB 204 Dec (2023)-2',
                description: 'Mathematics December 2023 paper (Version 2)',
                previewUrl: 'https://drive.google.com/file/d/1FVgN85sYyKkPGZ-MbNsDQfOaHnBnneVO/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1FVgN85sYyKkPGZ-MbNsDQfOaHnBnneVO',
                subject: 'All Branch MAB 204 Dec (2023)-2 - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2023-3',
                title: 'All Branch MAB 204 May (2023)-3',
                description: 'Mathematics May 2023 paper (Version 3)',
                previewUrl: 'https://drive.google.com/file/d/10hyy-cjb5h5gE06ScxT6OuMKqrkfnraH/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=10hyy-cjb5h5gE06ScxT6OuMKqrkfnraH',
                subject: 'All Branch MAB 204 May (2023)-3 - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2023-4',
                title: 'All Branch MAB 204 May (2023)-4',
                description: 'Mathematics May 2023 paper (Version 4)',
                previewUrl: 'https://drive.google.com/file/d/1tsnBBehvMXIsMFWH0SpbG0VH9Lx17l9i/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1tsnBBehvMXIsMFWH0SpbG0VH9Lx17l9i',
                subject: 'All Branch MAB 204 May (2023)-4 - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-2',
                title: 'All Branch MAB 204 May (2024)-2',
                description: 'Mathematics May 2024 paper (Version 2)',
                previewUrl: 'https://drive.google.com/file/d/1xOL5razcRgWSlu9Wu1JsQAXKGOZmv6JW/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1xOL5razcRgWSlu9Wu1JsQAXKGOZmv6JW',
                subject: 'All Branch MAB 204 May (2024)-2 - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cse-bc-303-dec-2023',
                title: 'CSE&BC 303 Dec (2023)',
                description: 'Computer System Organization December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1rsGv5dKl_bzFFVjLfZXpKZcMiZl5UMet/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1rsGv5dKl_bzFFVjLfZXpKZcMiZl5UMet',
                subject: 'CSE&BC 303 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'cse-bc-303-may-2024',
                title: 'CSE&BC 303 May (2024)',
                description: 'Computer System Organization May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1Xz7tlhgw06VIOQQhoTjZCx6dpXoHQjep/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1Xz7tlhgw06VIOQQhoTjZCx6dpXoHQjep',
                subject: 'CSE&BC 303 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'bc-304-may-2024',
                title: 'BC 304 May (2024)',
                description: 'BC 304 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1vMP5J6XXRg04SouNimymkga_-mvSrafl/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1vMP5J6XXRg04SouNimymkga_-mvSrafl',
                subject: 'BC 304 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-dec-2022',
                title: 'CS 304 &BC 304 Dec (2022)',
                description: 'Operating System December 2022 paper',
                previewUrl: 'https://drive.google.com/file/d/1DPZC5oEddjvBnNRzS1g7lPvNtvjNYTVT/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1DPZC5oEddjvBnNRzS1g7lPvNtvjNYTVT',
                subject: 'CS 304 &BC 304 Dec (2022) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-dec-2023',
                title: 'CS 304 &BC 304 Dec (2023)',
                description: 'Operating System December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1-uiPY5JL0yi9CvsVBE85x-b3tA9J11rv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1-uiPY5JL0yi9CvsVBE85x-b3tA9J11rv',
                subject: 'CS 304 &BC 304 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-may-2023',
                title: 'CS 304 &BC 304 May (2023)',
                description: 'Operating System May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1nknc6IBxLwi7PYdXBGlpiy-bRW8u9QlM/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1nknc6IBxLwi7PYdXBGlpiy-bRW8u9QlM',
                subject: 'CS 304 &BC 304 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-may-2024',
                title: 'CS 304 &BC 304 May (2024)',
                description: 'Operating System May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1A4sOOkr7AKEsWl68n30S_XPO29xelTzc/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1A4sOOkr7AKEsWl68n30S_XPO29xelTzc',
                subject: 'CS 304 &BC 304 May (2024) - Previous Year Question Paper'
            }
        ],
        ec: [
            {
                id: 'all-branch-305-dec-2023-ece',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-ece',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-ece',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-ece',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-ece',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-ece',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-ece',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        me: [
            {
                id: 'all-branch-305-dec-2023-me',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-me',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-me',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-me',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-me',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-me',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-me',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        ee: [
            {
                id: 'all-branch-305-dec-2023-ee',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-ee',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-ee',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-ee',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-ee',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-ee',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-ee',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        ce: [
            {
                id: 'all-branch-305-dec-2023-ce',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-ce',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-ce',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-ce',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-ce',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-ce',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-ce',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        iot: [
            {
                id: 'cs-302-bc-302-ai-302-io-302-may-2024-iot',
                title: 'CS 302,BC 302,AI 302,IO 302 May (2024)',
                description: 'Analysis and Design of Algorithms May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1ttz4PCtnZ9r_dNhJKAyV11VTdf8w039B/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1ttz4PCtnZ9r_dNhJKAyV11VTdf8w039B',
                subject: 'CS 302,BC 302,AI 302,IO 302 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-dec-2023-iot',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-iot',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-iot',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-iot',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-iot',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-iot',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-iot',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        it: [
            {
                id: 'all-branch-305-dec-2023-it',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-it',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-it',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-it',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-it',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-it',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-it',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        bct: [
            {
                id: 'cs-302-bc-302-dec-2023-bct',
                title: 'CS 302& BC 302 Dec (2023)',
                description: 'Analysis and Design of Algorithms December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1bGmm9NGwasdqFsKe_BP6wPN7AYllHkbB/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1bGmm9NGwasdqFsKe_BP6wPN7AYllHkbB',
                subject: 'CS 302& BC 302 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'cs-302-bc-302-may-2024-bct',
                title: 'CS 302 & BC 302 May (2024)',
                description: 'Analysis and Design of Algorithms May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/11Hw0ZqVIc49meJDCAVCnxj8-W8sP9hwO/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=11Hw0ZqVIc49meJDCAVCnxj8-W8sP9hwO',
                subject: 'CS 302 & BC 302 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cs-302-bc-302-nov-2024-bct',
                title: 'CS 302 & BC 302 Nov (2024)',
                description: 'Analysis and Design of Algorithms November 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/16KmQYNgW1YeV0z1imAgCqUYzIYydAUKk/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=16KmQYNgW1YeV0z1imAgCqUYzIYydAUKk',
                subject: 'CS 302 & BC 302 Nov (2024) - Previous Year Question Paper'
            },
            {
                id: 'bc-405-2023-bct',
                title: 'BC 405 (2023)',
                description: 'BC 405 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1FAhOTqmwEHfmONVvWZK8QRE607RmlE8T/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1FAhOTqmwEHfmONVvWZK8QRE607RmlE8T',
                subject: 'BC 405 (2023) - Previous Year Question Paper'
            },
            {
                id: 'bc-405-2024-bct',
                title: 'BC 405 (2024)',
                description: 'BC 405 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/17obXNv1vus58nI39nBpj20W3XXRIkJwo/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=17obXNv1vus58nI39nBpj20W3XXRIkJwo',
                subject: 'BC 405 (2024) - Previous Year Question Paper'
            },
            {
                id: 'oe-305-bc-305-may-2024-bct',
                title: 'OE 305 & BC 305 May (2024)',
                description: 'OE 305 & BC 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1amMspAnnSU0AzODTGlj15W09vnWh5UcF/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1amMspAnnSU0AzODTGlj15W09vnWh5UcF',
                subject: 'OE 305 & BC 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-bct',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-bct',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-bct',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-bct',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-dec-2022-bct',
                title: 'CS 304 &BC 304 Dec (2022)',
                description: 'Operating System December 2022 paper',
                previewUrl: 'https://drive.google.com/file/d/1DPZC5oEddjvBnNRzS1g7lPvNtvjNYTVT/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1DPZC5oEddjvBnNRzS1g7lPvNtvjNYTVT',
                subject: 'CS 304 &BC 304 Dec (2022) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-dec-2023-bct',
                title: 'CS 304 &BC 304 Dec (2023)',
                description: 'Operating System December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1-uiPY5JL0yi9CvsVBE85x-b3tA9J11rv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1-uiPY5JL0yi9CvsVBE85x-b3tA9J11rv',
                subject: 'CS 304 &BC 304 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-may-2023-bct',
                title: 'CS 304 &BC 304 May (2023)',
                description: 'Operating System May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1nknc6IBxLwi7PYdXBGlpiy-bRW8u9QlM/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1nknc6IBxLwi7PYdXBGlpiy-bRW8u9QlM',
                subject: 'CS 304 &BC 304 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'cs-304-bc-304-may-2024-bct',
                title: 'CS 304 &BC 304 May (2024)',
                description: 'Operating System May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1A4sOOkr7AKEsWl68n30S_XPO29xelTzc/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1A4sOOkr7AKEsWl68n30S_XPO29xelTzc',
                subject: 'CS 304 &BC 304 May (2024) - Previous Year Question Paper'
            }
        ],
        aiads: [
            {
                id: 'cs-302-bc-302-ai-302-io-302-may-2024-aiads',
                title: 'CS 302,BC 302,AI 302,IO 302 May (2024)',
                description: 'Analysis and Design of Algorithms May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1ttz4PCtnZ9r_dNhJKAyV11VTdf8w039B/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1ttz4PCtnZ9r_dNhJKAyV11VTdf8w039B',
                subject: 'CS 302,BC 302,AI 302,IO 302 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-dec-2023-aiads',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-aiads',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-aiads',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-aiads',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-aiads',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-aiads',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-aiads',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ],
        aiaml: [
            {
                id: 'all-branch-305-dec-2023-aiaml',
                title: 'All Branch 305 Dec (2023)',
                description: 'All Branch 305 December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1j1Idr2qqL7UTU1u815yypmntsvAzCfVv/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1j1Idr2qqL7UTU1u815yypmntsvAzCfVv',
                subject: 'All Branch 305 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2023-aiaml',
                title: 'All Branch 305 May (2023)',
                description: 'All Branch 305 May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1fA5_9TVbJUw3hEceQ0RU0sRgilc85Zo1',
                subject: 'All Branch 305 May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-305-may-2024-aiaml',
                title: 'All Branch 305 May (2024)',
                description: 'All Branch 305 May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1eOI10vGj4pdFhxG47nPMz_VfJsDl5Ue6',
                subject: 'All Branch 305 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-dec-2023-aiaml',
                title: 'All Branch DSA Dec (2023)',
                description: 'Data Structure and Algorithm December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1C9nRqJ0Dr3JeVrGnYSngT_JH64CuLUsD',
                subject: 'All Branch DSA Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-dsa-may-2023-aiaml',
                title: 'All Branch DSA May (2023)',
                description: 'Data Structure and Algorithm May 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=18Hfm308_8T8TjrMiHn4qzPhyWd3_09Kw',
                subject: 'All Branch DSA May (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023-aiaml',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper',
                previewUrl: 'https://drive.google.com/file/d/1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1EymWqGcOCo3IUe3bh9p5GmaOr13AugQg',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-may-2024-aiaml',
                title: 'All Branch MAB 204 May (2024)',
                description: 'Mathematics May 2024 paper',
                previewUrl: 'https://drive.google.com/file/d/1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS/preview',
                downloadUrl: 'https://drive.google.com/uc?export=download&id=1QB0y60SiTW4KmP99VhN4NxrnJLKBfJpS',
                subject: 'All Branch MAB 204 May (2024) - Previous Year Question Paper'
            }
        ]
    }
};

// Global Variables
let currentCategory = 'notes';
let currentBranch = null;
let currentResource = null;

// Save current state to localStorage
function saveCurrentState() {
    localStorage.setItem('sati_materials_category', currentCategory);
    localStorage.setItem('sati_materials_branch', currentBranch || '');
    localStorage.setItem('sati_materials_resource', currentResource || '');
}

// Load saved state from localStorage
function loadSavedState() {
    const savedCategory = localStorage.getItem('sati_materials_category');
    const savedBranch = localStorage.getItem('sati_materials_branch');
    const savedResource = localStorage.getItem('sati_materials_resource');
    
    if (savedCategory) {
        currentCategory = savedCategory;
    }
    if (savedBranch) {
        currentBranch = savedBranch || null;
    }
    if (savedResource) {
        currentResource = savedResource || null;
    }
}
let filteredResources = [];

// DOM Elements
const menuItems = document.querySelectorAll('.menu-item');
const subMenuItems = document.querySelectorAll('.sub-menu-item');
const resourceList = document.getElementById('resourceList');
const previewTitle = document.getElementById('previewTitle');
const pdfPreview = document.getElementById('pdfPreview');
const loadingSpinner = document.getElementById('loadingSpinner');
const loadingOverlay = document.getElementById('loadingOverlay');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const blurOverlay = document.getElementById('blurOverlay');
const shareModal = document.getElementById('shareModal');
const closeModal = document.getElementById('closeModal');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupEventListeners();
    loadDefaultContent();
});

// Initialize page settings
function initializePage() {
    // Load saved state first
    loadSavedState();
    
    // Check for saved theme - check multiple possible keys for compatibility
    const savedTheme = localStorage.getItem('sati_theme') ||
        localStorage.getItem('light') ||
        localStorage.getItem('theme') ||
        'dark';

    // Apply theme with system theme support
    applyTheme(savedTheme);

    // Ensure consistency across all storage keys
    localStorage.setItem('sati_theme', savedTheme);
    localStorage.setItem('light', savedTheme);
    localStorage.setItem('theme', savedTheme);

    // Setup system theme listener if needed
    if (savedTheme === 'system') {
        setupSystemThemeListener();
    }
}

// Apply theme with system theme detection
function applyTheme(theme) {
    let actualTheme = theme;

    // Handle system theme detection
    if (theme === 'system') {
        // Check if user's system prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            actualTheme = 'dark';
        } else {
            actualTheme = 'light';
        }
    }

    // Apply the actual theme
    document.documentElement.setAttribute('data-theme', actualTheme);

    // Update dark mode icon based on actual theme
    updateDarkModeIcon(actualTheme === 'dark');
}

// Setup system theme listener
function setupSystemThemeListener() {
    // Remove existing listener if any
    if (window.systemThemeListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', window.systemThemeListener);
        } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(window.systemThemeListener);
        }
    }

    // Create new listener
    window.systemThemeListener = (e) => {
        const savedTheme = localStorage.getItem('sati_theme') || localStorage.getItem('theme');
        if (savedTheme === 'system') {
            const actualTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', actualTheme);
            updateDarkModeIcon(actualTheme === 'dark');
        }
    };

    // Add listener with fallback for older browsers
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', window.systemThemeListener);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(window.systemThemeListener);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Sub-menu item clicks
    subMenuItems.forEach(item => {
        item.addEventListener('click', handleSubMenuClick);
    });

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Action buttons
    downloadBtn.addEventListener('click', handleDownload);
    shareBtn.addEventListener('click', handleShare);

    // Dark mode toggle
    darkModeToggle.addEventListener('change', toggleDarkMode);

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Modal functionality
    closeModal.addEventListener('click', closeShareModal);
    copyLinkBtn.addEventListener('click', copyShareLink);

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === shareModal) {
            closeShareModal();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-nav-menu')) {
            closeMobileMenu();
        }
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialShare);
    });

    // Mobile navigation links (exclude dropdown toggle)
    document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function () {
            closeMobileMenu();
        });
    });

    // Blur overlay click to close mobile menu
    if (blurOverlay) {
        blurOverlay.addEventListener('click', closeMobileMenu);
    }

    // Save state before page unload
    window.addEventListener('beforeunload', () => {
        saveCurrentState();
        console.log('Materials state saved before page unload');
    });
}

// Handle menu item clicks
function handleMenuClick(event) {
    const menuItem = event.currentTarget;
    const category = menuItem.getAttribute('data-category');

    // Handle dropdown items
    if (menuItem.classList.contains('dropdown-item')) {
        toggleDropdown(category);
        return;
    }

    // Update active menu item
    menuItems.forEach(item => item.classList.remove('active'));
    menuItem.classList.add('active');

    // Update current category
    currentCategory = category;
    currentBranch = null;
    currentResource = null; // Reset resource when changing category

    // Save current state
    saveCurrentState();

    // Load resources for this category
    loadResources(category);
}

// Handle sub-menu item clicks
function handleSubMenuClick(event) {
    const subMenuItem = event.currentTarget;
    const category = subMenuItem.getAttribute('data-category');
    const branch = subMenuItem.getAttribute('data-branch');

    // Update active sub-menu item
    subMenuItems.forEach(item => item.classList.remove('active'));
    subMenuItem.classList.add('active');

    // Update current category and branch
    currentCategory = category;
    currentBranch = branch;
    currentResource = null; // Reset resource when changing branch

    // Save current state
    saveCurrentState();

    // Load resources for this category and branch
    loadResources(category, branch);
}

// Toggle dropdown menus
function toggleDropdown(category) {
    const dropdown = document.getElementById(category + 'Dropdown');
    const menuItem = document.querySelector(`[data-category="${category}"]`);

    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        menuItem.classList.remove('active');
    } else {
        // Close other dropdowns
        document.querySelectorAll('.sidebar-dropdown-content').forEach(dd => {
            dd.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open this dropdown
        dropdown.classList.add('show');
        menuItem.classList.add('active');
    }
}

// Load resources based on category and branch
function loadResources(category, branch = null) {
    let resources = [];

    if (category === 'syllabus' || category === 'pyqs') {
        if (branch && resourcesData[category][branch]) {
            resources = resourcesData[category][branch];
        }
    } else {
        resources = resourcesData[category] || [];
    }

    filteredResources = resources;
    displayResources(resources);

    // Try to load saved resource, otherwise load first resource by default
    if (resources.length > 0) {
        let resourceToLoad = resources[0]; // Default to first resource
        
        // If there's a saved resource, try to find it
        if (currentResource) {
            const savedResource = resources.find(r => r.id === currentResource);
            if (savedResource) {
                resourceToLoad = savedResource;
            }
        }
        
        loadResource(resourceToLoad);
    } else {
        showEmptyState();
    }
}

// Display resources in the right sidebar
function displayResources(resources) {
    resourceList.innerHTML = '';

    if (resources.length === 0) {
        resourceList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No resources available</p>
            </div>
        `;
        return;
    }

    resources.forEach((resource, index) => {
        const resourceItem = document.createElement('div');
        // Set active based on saved resource or default to first
        const isActive = currentResource ? (resource.id === currentResource) : (index === 0);
        resourceItem.className = `resource-item ${isActive ? 'active' : ''}`;
        resourceItem.setAttribute('data-resource-id', resource.id);

        resourceItem.innerHTML = `
            <h4 class="tooltip">${resource.title}
                <span class="tooltiptext">${resource.description}</span>
            </h4>
            <p>${resource.description}</p>
        `;

        resourceItem.addEventListener('click', () => {
            // Update active resource item
            document.querySelectorAll('.resource-item').forEach(item => {
                item.classList.remove('active');
            });
            resourceItem.classList.add('active');

            // Update current resource ID and save state
            currentResource = resource.id;
            saveCurrentState();

            // Load this resource
            loadResource(resource);
        });

        resourceList.appendChild(resourceItem);
    });
}

// Load a specific resource in the preview area
function loadResource(resource) {
    currentResource = resource.id; // Store the ID for persistence
    
    // Save current state
    saveCurrentState();

    // Update title
    previewTitle.textContent = resource.subject;

    // Show loading spinner immediately
    showLoading();

    // Always clear the previous PDF src and hide it before loading a new one
    pdfPreview.src = '';
    pdfPreview.style.display = 'none';

    // Simulate loading delay (remove this in production)
    setTimeout(() => {
        if (resource.previewUrl) {
            loadPDFPreview(resource.previewUrl);
        } else {
            showPlaceholder();
        }
    }, 1000);

    // Update action buttons
    updateActionButtons(resource);
}

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'flex';
    if (loadingOverlay) loadingOverlay.style.display = 'block';
    pdfPreview.style.display = 'none';
    // Optionally, reset spinner content
    loadingSpinner.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading preview...</p>
    `;
}

// Load PDF preview
function loadPDFPreview(url) {
    pdfPreview.onload = function () {
        loadingSpinner.style.display = 'none';
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        pdfPreview.style.display = 'block';
    };
    // Fallback: hide spinner/overlay after 10s if PDF fails to load
    setTimeout(() => {
        if (loadingSpinner.style.display !== 'none') {
            loadingSpinner.style.display = 'none';
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            pdfPreview.style.display = 'block';
        }
    }, 10000);
    pdfPreview.src = url;
}

// Show placeholder when no preview URL is available
function showPlaceholder() {
    loadingSpinner.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        <p>Preview will be available soon</p>
        <small>PDF preview links will be added by administrator</small>
    `;
}

// Show empty state
function showEmptyState() {
    previewTitle.textContent = 'Select a resource to preview';
    loadingSpinner.innerHTML = `
        <i class="fas fa-folder-open"></i>
        <p>No resources selected</p>
        <small>Choose a category and resource from the sidebar</small>
    `;
    loadingSpinner.style.display = 'flex';
    pdfPreview.style.display = 'none';
}

// Update action buttons based on current resource
function updateActionButtons(resource) {
    downloadBtn.onclick = () => {
        if (resource.downloadUrl) {
            window.open(resource.downloadUrl, '_blank');
        } else {
            showNotification('Download link not available yet', 'warning');
        }
    };

    shareBtn.onclick = () => {
        if (resource.previewUrl) {
            openShareModal(resource);
        } else {
            showNotification('Share link not available yet', 'warning');
        }
    };
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm === '') {
        displayResources(filteredResources);
        return;
    }

    const filtered = filteredResources.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm)
    );

    displayResources(filtered);
}

// Handle download button click
function handleDownload() {
    if (currentResource && currentResource.downloadUrl) {
        window.open(currentResource.downloadUrl, '_blank');
    } else {
        showNotification('Download link not available yet', 'warning');
    }
}

// Handle share button click
function handleShare() {
    if (currentResource) {
        openShareModal(currentResource);
    }
}

// Open share modal
function openShareModal(resource) {
    const shareUrl = resource.previewUrl || window.location.href;
    shareLink.value = shareUrl;
    shareModal.style.display = 'block';
}

// Close share modal
function closeShareModal() {
    shareModal.style.display = 'none';
}

// Copy share link to clipboard
function copyShareLink() {
    shareLink.select();
    shareLink.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

// Handle social media sharing
function handleSocialShare(event) {
    const platform = event.currentTarget.classList[1];
    const url = shareLink.value;
    const title = currentResource ? currentResource.title : 'SATI Resource';

    let shareUrl = '';

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this resource: ' + url)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const currentActualTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentActualTheme === 'dark' ? 'light' : 'dark';

    // Apply theme
    applyTheme(newTheme);

    // Save to all possible localStorage keys for consistency across pages
    localStorage.setItem('sati_theme', newTheme);
    localStorage.setItem('light', newTheme);
    localStorage.setItem('theme', newTheme);

    // Remove system theme listener since we're switching to explicit theme
    if (window.systemThemeListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', window.systemThemeListener);
        } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(window.systemThemeListener);
        }
        window.systemThemeListener = null;
    }
}

// Update dark mode toggle state
function updateDarkModeIcon(isDark) {
    // Set checkbox state based on theme (checked = dark mode)
    darkModeToggle.checked = isDark;
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileNavMenu.classList.toggle('show');

    // Update mobile menu toggle icon
    const icon = mobileMenuToggle.querySelector('i');
    if (mobileNavMenu.classList.contains('show')) {
        icon.className = 'fas fa-times';
        // Add blur effect to body and show overlay
        document.body.classList.add('mobile-menu-open');
        if (blurOverlay) {
            blurOverlay.classList.add('show');
        }
    } else {
        icon.className = 'fas fa-bars';
        // Remove blur effect from body and hide overlay
        document.body.classList.remove('mobile-menu-open');
        if (blurOverlay) {
            blurOverlay.classList.remove('show');
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    mobileNavMenu.classList.remove('show');
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = 'fas fa-bars';
    // Remove blur effect from body and hide overlay
    document.body.classList.remove('mobile-menu-open');
    if (blurOverlay) {
        blurOverlay.classList.remove('show');
    }
}

// Load default content on page load
function loadDefaultContent() {
    // Restore saved state or use default
    restoreSavedUIState();
    
    // Load resources for current category and branch
    loadResources(currentCategory, currentBranch);
    
    // If there's a saved resource, try to select it
    if (currentResource) {
        setTimeout(() => {
            selectSavedResource();
        }, 500); // Small delay to ensure resources are loaded
    }
}

// Restore the UI state based on saved values
function restoreSavedUIState() {
    // Clear all active states first
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.sub-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Set the correct menu item as active
    const menuItem = document.querySelector(`[data-category="${currentCategory}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
        
        // If it's a dropdown category, open the dropdown and set branch active
        if ((currentCategory === 'syllabus' || currentCategory === 'pyqs') && currentBranch) {
            toggleDropdown(currentCategory);
            const subMenuItem = document.querySelector(`[data-category="${currentCategory}"][data-branch="${currentBranch}"]`);
            if (subMenuItem) {
                subMenuItem.classList.add('active');
            }
        }
    }
}

// Select the saved resource if it exists
function selectSavedResource() {
    if (currentResource) {
        const resourceItem = document.querySelector(`[data-resource-id="${currentResource}"]`);
        if (resourceItem) {
            resourceItem.click();
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        border-left: 4px solid var(--primary-color);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 2001;
        min-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: var(--accent-color);
    }
    
    .notification-warning {
        border-left-color: #ff9800;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: var(--accent-color);
    }
    
    .notification-warning i {
        color: #ff9800;
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Show coming soon notification
function showComingSoon(feature) {
    showNotification(`${feature} feature is coming soon!`, 'info');
}

// Utility function to convert Google Drive links to embed format
function convertToEmbedUrl(driveUrl) {
    if (driveUrl.includes('drive.google.com')) {
        const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId[1]}/preview`;
        }
    }
    return driveUrl;
}

// Function to update resource data (to be called when user provides links)
function updateResourceData(resourceId, previewUrl, downloadUrl) {
    // Find and update the resource in the data structure
    function findAndUpdate(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                if (item.id === resourceId) {
                    item.previewUrl = convertToEmbedUrl(previewUrl);
                    item.downloadUrl = downloadUrl;
                }
            });
        } else if (typeof obj === 'object') {
            Object.values(obj).forEach(value => {
                findAndUpdate(value);
            });
        }
    }

    findAndUpdate(resourcesData);

    // If this is the currently loaded resource, update the preview
    if (currentResource && currentResource.id === resourceId) {
        currentResource.previewUrl = convertToEmbedUrl(previewUrl);
        currentResource.downloadUrl = downloadUrl;
        loadPDFPreview(currentResource.previewUrl);
        updateActionButtons(currentResource);
    }
}

// Export function for external use
window.updateResourceData = updateResourceData;

// Function to show coming soon message for navbar links
function showComingSoon(pageName) {
    showNotification(`${pageName} page coming soon!`, 'info');
}

// Export function for external use
window.showComingSoon = showComingSoon;

// Navigation Dropdown Functionality
function initializeDropdownFunctionality() {
    // Mobile dropdown toggle functionality - simplified approach like programming.js
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('open');
        });
    });
    
    // Handle disabled dropdown items
    const disabledItems = document.querySelectorAll('.dropdown-item.disabled, .mobile-dropdown-item.disabled');
    disabledItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    // Close mobile menu when dropdown item is clicked (except disabled ones)
    const dropdownItems = document.querySelectorAll('.mobile-dropdown-item:not(.disabled)');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close mobile menu
            const mobileMenu = document.getElementById('mobileNavMenu');
            const blurOverlay = document.getElementById('blurOverlay');
            
            if (mobileMenu) {
                mobileMenu.classList.remove('show');
                document.body.classList.remove('mobile-menu-open');
            }
            
            if (blurOverlay) {
                blurOverlay.classList.remove('show');
            }
        });
    });
}

// Simple Navigation Dropdown with Dynamic Labels
function initializeNavigationDropdown() {
    // Handle dropdown item clicks for dynamic label changes
    const dropdownItems = document.querySelectorAll('.dropdown-item:not(.disabled)');
    const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-item:not(.disabled)');
    
    // Desktop dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemText = this.textContent.trim();
            const href = this.getAttribute('href');
            
            // Update the dropdown toggle text
            updateDropdownLabel(itemText);
            
            // Navigate to the page
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Mobile dropdown items
    mobileDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemText = this.textContent.trim();
            const href = this.getAttribute('href');
            
            // Update the mobile dropdown toggle text
            updateMobileDropdownLabel(itemText);
            
            // Close mobile menu after selection
            closeMobileMenu();
            
            // Navigate to the page
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Mobile dropdown functionality is now handled in initializeDropdownFunctionality()
    
    // Set current page active state
    setCurrentPageActive();
}

// Close mobile menu function
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileNavMenu');
    const blurOverlay = document.getElementById('blurOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (mobileMenu) {
        mobileMenu.classList.remove('show');
        document.body.classList.remove('mobile-menu-open');
    }
    
    if (blurOverlay) {
        blurOverlay.classList.remove('show');
    }
    
    // Reset mobile menu toggle icon
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
    }
}

// Update desktop dropdown label
function updateDropdownLabel(newLabel) {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.innerHTML = `${newLabel} <i class="fas fa-chevron-down"></i>`;
    }
}

// Update mobile dropdown label
function updateMobileDropdownLabel(newLabel) {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        const spanElement = mobileDropdownToggle.querySelector('span');
        if (spanElement) {
            spanElement.textContent = newLabel;
        }
    }
}

// Set current page active state based on URL
function setCurrentPageActive() {
    const currentPath = window.location.pathname;
    
    // Handle materials page
    if (currentPath.includes('/resources/materials.html')) {
        updateDropdownLabel('Materials');
        updateMobileDropdownLabel('Materials');
    }
}

// Desktop dropdown delay functionality
function initializeDesktopDropdownDelay() {
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    let hideTimeout;

    if (navDropdown && dropdownMenu) {
        // Show dropdown on hover
        navDropdown.addEventListener('mouseenter', function () {
            // Clear any existing timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            // Show dropdown immediately
            dropdownMenu.classList.add('show');
        });

        // Hide dropdown with delay on mouse leave
        navDropdown.addEventListener('mouseleave', function () {
            // Set timeout to hide dropdown after 500ms
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });

        // If mouse enters dropdown menu, clear hide timeout
        dropdownMenu.addEventListener('mouseenter', function() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // If mouse leaves dropdown menu, start hide timeout
        dropdownMenu.addEventListener('mouseleave', function() {
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });
    }
}

// Initialize dropdown functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdownFunctionality();
    initializeNavigationDropdown();
    initializeDesktopDropdownDelay();
});