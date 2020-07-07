import {Venue} from "./venue";
import {User} from "./user";

export class DummyData{

  static MEETINGS: any[] = [
    {
      pointedDate:
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'پویان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-1.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'عطیه',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-2.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'مصاحبه',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "DONE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'قادر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-2.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'اکبر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-3.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'امیرارسلان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-6.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'بررسی مسائل خاورمیانه',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "DONE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1100',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'مراد',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-3.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'تبلیغ اپلیکیشن شالاپ',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "GOING_ON",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1315',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'محدثه‌ سادات حسینی',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-4.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'مراسم شعرخوانی',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "CANCELLED",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1530',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'کاوه آهنگر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-5.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'توضیح مسئله‌ی الیناسیون',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "LATE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'یاور کی‌مرام',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-5.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'قمار',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "GETTING_LATE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1610',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'جعفر کفن‌پوش',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-7.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'ملیله دوزی',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "TO_BE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'قادر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-2.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'اکبر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-3.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'امیرارسلان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-6.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'بررسی مسائل خاورمیانه',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "DONE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1100',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'مراد',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-3.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'تبلیغ اپلیکیشن شالاپ',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "GOING_ON",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1315',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'محدثه‌ سادات حسینی',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-4.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'مراسم شعرخوانی',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "CANCELLED",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1530',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'کاوه آهنگر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-5.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'توضیح مسئله‌ی الیناسیون',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "LATE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'یاور کی‌مرام',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-5.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'قمار',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "GETTING_LATE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1610',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'جعفر کفن‌پوش',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-7.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'ملیله دوزی',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "TO_BE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'پویان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-1.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'عطیه',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-2.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'مصاحبه',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "DONE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0930',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'قادر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-2.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'اکبر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-3.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'امیرارسلان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-6.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'بررسی مسائل خاورمیانه',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "DONE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1100',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'مراد',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-3.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'تبلیغ اپلیکیشن شالاپ',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "GOING_ON",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1315',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '0900',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'محدثه‌ سادات حسینی',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-4.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'مراسم شعرخوانی',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "CANCELLED",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1530',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'کاوه آهنگر',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-5.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'توضیح مسئله‌ی الیناسیون',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "LATE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'یاور کی‌مرام',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-5.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'قمار',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "GETTING_LATE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    },
    {
      pointedDate:
        {
          startTime: '1610',
          endTime: '1030',
          date: new Date()
        },
      dates: [
        {
          startTime: '1500',
          endTime: '1030',
          date: new Date()
        }
      ],
      attendees: [
        {
          name: 'جعفر کفن‌پوش',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-7.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      title: 'ملیله دوزی',
      venue: new Venue(),
      chairId: -1,
      welcomeMessage: "این هم سلام سلامتی",
      eventType: "MEETING",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "TO_BE",
      chair: {
        name: 'آقای خوش‌بروخورد',
        phone: '009',
        imageUrl: '../assets/images/dummy/contact-5.png',
        id: 100,
        email: 'khoshkholgh@gmail.com',
      }
    }
  ];

  static USER: any = {
    id: 1,
    username: "demouser",
    password: "123456",
    name: "Demo User",
    latitude: 25.25857,
    longitude: -99.68371,
    phone: "091211112321",
    farsiAddress1: "تهران خیابان اول",
    imageUrl: '../assets/images/dummy/contact-3.png',
    farsiAddress2: "",
    description: "یک انسان بسیار پاکیزه",
    role: 'owner'
  };


  static COMMENTS: any[] = [
    {
      userImageUrl: '../assets/images/dummy/contact-7.png',
      text: 'واقعا این کار بیخودیه که هی میای اینجا رو چک میکنی و میبینی که خبری نیست و هی برمیگردی دوباره',
      userName: 'گاوچرون'
    },
    {
      userImageUrl: '../assets/images/dummy/contact-6.png',
      text: 'من یکی از بزرگترین آرزوهام اینه که یه روزی گاوچرون بشم :)',
      userName: 'خرچرون'
    }
  ]

  static CONTACTS: any[] = [
    {
      id: 1,
      name: 'قلی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'owner'
    },
    {
      id: 1,
      name: 'ممد جوشقانی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'reception'
    },
    {
      id: 1,
      name: 'داریوش اقبالی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-6.png',
      contactType: 'employee',
      role: 'user'
    },
    {
      id: 1,
      name: 'محمد توللی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-5.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'پرویز یاحقی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-2.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'گوینده روشنک',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-3.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'قلی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'owner'
    },
    {
      id: 1,
      name: 'ممد جوشقانی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'reception'
    },
    {
      id: 1,
      name: 'داریوش اقبالی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-6.png',
      contactType: 'employee',
      role: 'user'
    },
    {
      id: 1,
      name: 'محمد توللی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-5.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'پرویز یاحقی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-2.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'قلی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'owner'
    },
    {
      id: 1,
      name: 'ممد جوشقانی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'reception'
    },
    {
      id: 1,
      name: 'داریوش اقبالی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-6.png',
      contactType: 'employee',
      role: 'user'
    },
    {
      id: 1,
      name: 'محمد توللی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-5.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'پرویز یاحقی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-2.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'گوینده روشنک',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-3.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'قلی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'owner'
    },
    {
      id: 1,
      name: 'ممد جوشقانی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'reception'
    },
    {
      id: 1,
      name: 'داریوش اقبالی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-6.png',
      contactType: 'employee',
      role: 'user'
    },
    {
      id: 1,
      name: 'محمد توللی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-5.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'پرویز یاحقی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-2.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'قلی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'owner'
    },
    {
      id: 1,
      name: 'ممد جوشقانی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'reception'
    },
    {
      id: 1,
      name: 'داریوش اقبالی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-6.png',
      contactType: 'employee',
      role: 'user'
    },
    {
      id: 1,
      name: 'محمد توللی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-5.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'پرویز یاحقی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-2.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'گوینده روشنک',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-3.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'قلی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'owner'
    },
    {
      id: 1,
      name: 'ممد جوشقانی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-1.png',
      contactType: 'employee',
      role: 'reception'
    },
    {
      id: 1,
      name: 'داریوش اقبالی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-6.png',
      contactType: 'employee',
      role: 'user'
    },
    {
      id: 1,
      name: 'محمد توللی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-5.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'پرویز یاحقی',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-2.png',
      contactType: 'contact'
    },
    {
      id: 1,
      name: 'گوینده روشنک',
      phone: '09090909090',
      email: 'contact@gmail.com',
      address: 'فلکه دوم جیرفت، در سومی نرسیده به ۱۷ کیلومتری جنب بانک',
      imageUrl: '../assets/images/dummy/contact-3.png',
      contactType: 'contact'
    },
  ];

  static VENUES: any[] = [
    {
      id: 1,
      title : 'محل ملاقات آدم‌های معمولی',
      latitude : 18.5793,
      longitude : 73.8143,
      farsiAddress1: 'تهران، خیابان اول، در آبیه',
      farsiAddress2: ''
    },{
      id: 1,
      title : 'محل ملاقات آدم‌های مهم',
      latitude : 18.5793,
      longitude : 73.8143,
      farsiAddress1: 'تهران، خیابان اول، در زرده',
      farsiAddress2: ''
    },{
      id: 1,
      title : 'محل ملاقات آدم‌های خیلی مهم',
      latitude : 18.5793,
      longitude : 73.8143,
      farsiAddress1: 'تهران، خیابان اول، در قرمزه',
      farsiAddress2: ''
    },
  ];


  static TOKENS: any[] = [
    {
      fromDate: new Date(),
      toDate: new Date(),
      attendees: [
        {
          name: 'پویان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-1.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
        {
          name: 'عطیه',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-2.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        }
      ],
      venue: new Venue(),
      chairId: -1,
      eventType: "TOKEN",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "VALID",
      oneTime: true
    },
    {
      fromDate: new Date(),
      toDate: new Date(),
      attendees: [
        {
          name: 'پویان',
          email: 'ati@gmail.com',
          phone: '',
          imageUrl: '../assets/images/dummy/contact-1.png',
          image: File,
          id: 2,
          fileName: '',
          type: 'contact'
        },
      ],
      venue: new Venue(),
      chairId: -1,
      eventType: "TOKEN",
      contactEvents: [{
        contactId: 1,
        status: ''
      }],
      status: "EXPIRED",
      oneTime: false
    },
    ];
}

