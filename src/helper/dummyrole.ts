export const roledata = {
    data: {
        category: [
            {
                id: 2,
                name: 'show-category',
                front_name: 'categories/show',
                title: 'show categories',
                en: {
                    title: 'show categories',
                },
                ar: {
                    title: 'عرض الاقسام',
                },
            },
            {
                id: 3,
                name: 'create-category',
                front_name: 'categories/create',
            },
            {
                id: 4,
                name: 'update-category',
                front_name: 'categories/update',
            },
            {
                id: 5,
                name: 'delete-category',
                front_name: 'categories/delete',
            },
            {
                id: 6,
                name: 'select-category',
                front_name: 'categories/select',
            },
            {
                id: 1,
                name: 'index-category',
                front_name: 'categories/show-all',
            },
        ],
        client: [
            {
                id: 7,
                name: 'index-client',
                front_name: 'clients/show-all',
                title: 'show clients',
                en: {
                    title: 'show clients',
                },
                ar: {
                    title: 'عرض كل العملاء',
                },
            },
            {
                id: 8,
                name: 'show-client',
                front_name: 'clients/show',
            },
            {
                id: 9,
                name: 'create-client',
                front_name: 'clients/create',
            },
            {
                id: 10,
                name: 'update-client',
                front_name: 'clients/edit',
            },
            {
                id: 11,
                name: 'delete-client',
                front_name: 'clients/delete',
            },
            {
                id: 12,
                name: 'select-client',
                front_name: 'clients/select',
            },
            {
                id: 13,
                name: 'export excel-client',
                front_name: 'clients/export',
            },
            {
                id: 14,
                name: 'export pdf-client',
                front_name: 'clients/export',
            },
        ],
        employee: [
            {
                id: 15,
                name: 'show-employee',
                front_name: 'employees/show',
                title: 'show employees',
                en: {
                    title: 'show employees',
                },
                ar: {
                    title: 'عرض الموظفين',
                },
            },
            {
                id: 16,
                name: 'create-employee',
                front_name: 'employees/create',
            },
            {
                id: 17,
                name: 'update-employee',
                front_name: 'employees/update',
            },
            {
                id: 18,
                name: 'delete-employee',
                front_name: 'employees/delete',
            },
            {
                id: 19,
                name: 'select-employee',
                front_name: 'employees/select',
            },
            {
                id: 20,
                name: 'index-employee',
                front_name: 'employees/show-all',
            },
        ],
        faq: [
            {
                id: 21,
                question: 'What is FAQ?',
                answer: 'FAQ stands for Frequently Asked Questions. It is a list of common questions and answers on a particular topic.',
                language: 'en',
            },
            {
                id: 22,
                question: 'ما هو الأسئلة الشائعة؟',
                answer: 'الأسئلة الشائعة هي عبارة عن قائمة من الأسئلة والأجوبة الشائعة حول موضوع معين.',
                language: 'ar',
            },
        ],
        notification: [
            {
                id: 23,
                message: 'New notification received!',
                type: 'info',
            },
            {
                id: 24,
                message: 'تلقي إشعار جديد!',
                type: 'info',
            },
        ],
        order: [
            {
                id: 25,
                order_number: 'ORD12345',
                total_amount: 100.5,
                status: 'pending',
            },
            {
                id: 26,
                order_number: 'ORD54321',
                total_amount: 200.75,
                status: 'shipped',
            },
        ],
        product: [
            {
                id: 27,
                name: 'Product 1',
                description: 'This is product 1 description.',
                price: 50.25,
            },
            {
                id: 28,
                name: 'Product 2',
                description: 'This is product 2 description.',
                price: 75.99,
            },
        ],
        page: [
            {
                id: 29,
                title: 'About Us',
                content: 'This is the About Us page content.',
            },
            {
                id: 30,
                title: 'Contact Us',
                content: 'This is the Contact Us page content.',
            },
        ],
        slider: [
            {
                id: 31,
                image_url: 'slider1.jpg',
                caption: 'Welcome to our website!',
            },
            {
                id: 32,
                image_url: 'slider2.jpg',
                caption: 'Check out our latest products!',
            },
        ],
        tag: [
            {
                id: 33,
                name: 'Technology',
            },
            {
                id: 34,
                name: 'Fashion',
            },
        ],
        report: [
            {
                id: 35,
                title: 'Sales Report',
                description: 'This is the sales report for the month of January.',
            },
            {
                id: 36,
                title: 'Financial Report',
                description: 'This is the financial report for the year 2023.',
            },
        ],
        setting: [
            {
                id: 37,
                name: 'General',
                value: 'Some general settings',
            },
            {
                id: 38,
                name: 'Appearance',
                value: 'Some appearance settings',
            },
        ],
        contacts: [
            {
                id: 39,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
            },
            {
                id: 40,
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '9876543210',
            },
        ],
        cities: [
            {
                id: 41,
                name: 'New York',
            },
            {
                id: 42,
                name: 'Los Angeles',
            },
        ],
        countries: [
            {
                id: 43,
                name: 'United States',
            },
            {
                id: 44,
                name: 'Canada',
            },
        ],
        permissions: [
            {
                id: 45,
                name: 'read',
                description: 'Permission to read data',
            },
            {
                id: 46,
                name: 'write',
                description: 'Permission to write data',
            },
        ],
        roles: [
            {
                id: 47,
                name: 'admin',
                description: 'Administrator role',
            },
            {
                id: 48,
                name: 'user',
                description: 'Regular user role',
            },
        ],
    },
};
