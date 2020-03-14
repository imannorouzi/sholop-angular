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
      status: "DONE"
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
      status: "DONE"
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
      status: "GOING_ON"
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
      status: "CANCELLED"
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
      status: "LATE"
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
      status: "GETTING_LATE"
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
      status: "TO_BE"
    }
  ];
  static USER: any = {
    id: 1,
    username: "demouser",
    password: "123456",
    name: "Demo User",
    imageUrl: "",
    latitude: 25.25857,
    longitude: -99.68371,
    phone: "091211112321",
    farsiAddress1: "تهران خیابان اول",
    farsiAddress2: "",
    description: "یک انسان بسیار پاکیزه",
  }
}

