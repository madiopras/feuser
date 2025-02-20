import { StayDataType, ExperiencesDataType, CarDataType, AuthorType } from './types';

export interface CarListing {
  id: string;
  title: string;
  href: string;
  featuredImage: string;
  price: string;
  [key: string]: any;
}

export interface StayListing {
  id: string;
  title: string;
  href: string;
  featuredImage: string;
  price: string;
  [key: string]: any;
}

export interface ExperienceListing {
  id: string;
  title: string;
  href: string;
  featuredImage: string;
  price: string;
  [key: string]: any;
}

const demoAuthor: AuthorType = {
  id: "1",
  firstName: "Demo",
  lastName: "Author",
  displayName: "Demo Author",
  avatar: "/images/avatars/default.png",
  bgImage: "/images/placeholder.jpg",
  email: "",
  count: 0,
  desc: "",
  jobName: "",
  href: "#",
  starRating: 5
};

export const DEMO_EXPERIENCES_LISTINGS: ExperiencesDataType[] = [{
  id: "1",
  author: demoAuthor,
  date: "2023-01-01",
  href: "#",
  title: "Demo Experience",
  featuredImage: "/images/placeholder.jpg",
  commentCount: 0,
  viewCount: 0,
  address: "Demo Address",
  reviewStart: 5,
  reviewCount: 1,
  like: false,
  galleryImgs: ["/images/placeholder.jpg"],
  price: "$100",
  listingCategory: {
    id: 1,
    name: "Experiences",
    href: "#",
    taxonomy: "category",
    listingType: "experiences"
  },
  maxGuests: 4,
  saleOff: null,
  isAds: null,
  map: { lat: 0, lng: 0 }
}];

export const DEMO_CAR_LISTINGS: CarDataType[] = [{
  id: "1",
  author: demoAuthor,
  date: "2023-01-01",
  href: "#",
  title: "Demo Car",
  featuredImage: "/images/placeholder.jpg",
  commentCount: 0,
  viewCount: 0,
  address: "Demo Address",
  reviewStart: 5,
  reviewCount: 1,
  like: false,
  galleryImgs: ["/images/placeholder.jpg"],
  price: "$50",
  listingCategory: {
    id: 1,
    name: "Cars",
    href: "#",
    taxonomy: "category",
    listingType: "car"
  },
  seats: 4,
  gearshift: "Manual",
  saleOff: null,
  isAds: null,
  map: { lat: 0, lng: 0 }
}];

export const DEMO_STAY_LISTINGS: StayDataType[] = [{
  id: "1",
  author: demoAuthor,
  date: "2023-01-01",
  href: "#",
  title: "Demo Stay",
  featuredImage: "/images/placeholder.jpg",
  commentCount: 0,
  viewCount: 0,
  address: "Demo Address",
  reviewStart: 5,
  reviewCount: 1,
  like: false,
  galleryImgs: ["/images/placeholder.jpg"],
  price: "$150",
  listingCategory: {
    id: 1,
    name: "Stays",
    href: "#",
    taxonomy: "category",
    listingType: "stay"
  },
  maxGuests: 4,
  bedrooms: 2,
  bathrooms: 1,
  saleOff: null,
  isAds: null,
  map: { lat: 0, lng: 0 }
}];