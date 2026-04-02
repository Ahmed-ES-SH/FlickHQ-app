import { commentType, ReviewType } from "../types/websiteTypes";
import { TiBook } from "react-icons/ti";
import { TbTicket } from "react-icons/tb";
import { PiScreencastBold, PiDownloadBold } from "react-icons/pi";
import { MdRecommend, MdOutlineDevicesOther } from "react-icons/md";
import { RiParentFill } from "react-icons/ri";
import { FaStream } from "react-icons/fa";

//navbar
export const opation_nav = [
  { text: "About us", link: "/about" },
  { text: "profile", link: "/profile" },
  { text: "Contactus", link: "/contactus" },
  { text: "Privacy policy", link: "/privacypolicy" },
  { text: "Sign in", link: "/signin" },
  { text: "Sign up", link: "/signup" },
  { text: "Forgot password", link: "/forgetpassword" },
  { text: "404 Page", link: "/not-found" },
];

export const navLinks = [
  {
    label: "Home",
    href: "/",
    type: "link",
  },
  {
    label: "Shows",
    type: "custom", // عنصر مخصص (ليس رابطًا فعليًا)
    href: "/shows",
  },
  {
    label: "Movies",
    href: "/movies",
    type: "link",
  },
  {
    label: "Pricing plans",
    href: "/pricing",
    type: "link",
  },
];

//footer
export const opation_shop = [
  "Sell online",
  "Features",
  "Examples",
  "Website editors",
  "Online retail",
];
export const opation_press = [
  "Events",
  "News",
  "Awards",
  "Testimonials",
  "Online retail",
];
export const opation_about = [
  "Contact",
  "Services",
  "Team",
  "Career",
  "Contacts",
];

export const dash_navs = [
  {
    title: "Profile",
    icon: "fa-solid fa-user",
  },
  {
    title: "watched",
    icon: "fa-solid fa-eye",
  },
  {
    title: "Watchlist",
    icon: "fa-solid fa-list-check",
  },
  {
    title: "Favorite",
    icon: "fa-solid fa-heart",
  },
];

// Plans Section
export const sharedOptions = [
  "FlickHQ Originals",
  "Switch plans or cancel anytime",
  "Stream 65+ top Live",
  "TV channels",
];

// All Plans Section
export const AllSharedOptions = [
  { text: "FlickHQ Originals", status: [true, true, true] },
  {
    text: "Get unlimited access to the largest streaming library with no ads",
    status: [true, true, true],
  },
  {
    text: "Watch Live TV online and on supported devices",
    status: [true, true, true],
  },
  { text: "Switch plans or cancel anytime", status: [true, true, true] },
  {
    text: "Record live TV with 50 hours of Cloud DVR storage",
    status: [false, true, true],
  },
  { text: "Stream 65+ top Live", status: [false, true, true] },
  { text: "TV channels", status: [false, false, true] },
  { text: "", buttons: [true, true, true] },
];

export const plans = [
  {
    title: "Regular",
    price: 11.99,
    icons: [true, true, false, false],
  },
  {
    title: "Premium",
    price: 34.99,
    icons: [true, true, true, false],
  },
  {
    title: "Premium + TV channels",
    price: 49.99,
    icons: [true, true, true, true],
  },
];

export const plansWithAllOpations = [
  {
    title: "Regular",
    price: 11.99,
    icons: [true, true, true, true, false, false, false],
  },
  {
    title: "Premium",
    price: 34.99,
    icons: [true, true, true, true, true, true, false],
  },
  {
    title: "Premium + TV channels",
    price: 49.99,
    icons: [true, true, true, true, true, true, true],
  },
];

//movie Page
export const Itemcomments: commentType[] = [
  {
    content: "This movie exceeded my expectations, especially the ending!",
    author: "John Doe",
    date: "2025-05-01",
    time: "14:32",
    likes: 18,
    dislikes: 2,
  },
  {
    content: "Great cinematography but the story felt a bit rushed.",
    author: "Emily Smith",
    date: "2025-05-01",
    time: "15:21",
    likes: 12,
    dislikes: 3,
  },
  {
    content: "Loved the characters, they felt very real and relatable.",
    author: "Liam Johnson",
    date: "2025-05-02",
    time: "09:10",
    likes: 25,
    dislikes: 1,
  },
  {
    content: "Not my cup of tea. I got bored halfway through.",
    author: "Sophia Lee",
    date: "2025-05-02",
    time: "10:45",
    likes: 5,
    dislikes: 9,
  },
  {
    content: "A decent watch, though I wouldn't call it groundbreaking.",
    author: "Noah Brown",
    date: "2025-05-02",
    time: "13:00",
    likes: 14,
    dislikes: 4,
  },
  {
    content: "Incredible performance by the lead actor!",
    author: "Olivia Davis",
    date: "2025-05-03",
    time: "11:37",
    likes: 30,
    dislikes: 0,
  },
  {
    content: "It had potential but poor writing dragged it down.",
    author: "William Wilson",
    date: "2025-05-03",
    time: "18:05",
    likes: 7,
    dislikes: 6,
  },
  {
    content: "Music score was phenomenal and enhanced every scene.",
    author: "Ava Miller",
    date: "2025-05-04",
    time: "16:23",
    likes: 19,
    dislikes: 1,
  },
  {
    content: "The plot twist really got me. Didn’t see that coming!",
    author: "James Moore",
    date: "2025-05-04",
    time: "19:41",
    likes: 22,
    dislikes: 2,
  },
  {
    content: "Some scenes felt overly dramatic but still enjoyable.",
    author: "Isabella Taylor",
    date: "2025-05-04",
    time: "20:15",
    likes: 13,
    dislikes: 3,
  },
  {
    content: "Beautiful direction, but weak dialogue in parts.",
    author: "Benjamin Anderson",
    date: "2025-05-04",
    time: "22:10",
    likes: 10,
    dislikes: 4,
  },
  {
    content: "I appreciate the effort, but it lacked emotional depth.",
    author: "Mia Thomas",
    date: "2025-05-05",
    time: "08:55",
    likes: 8,
    dislikes: 5,
  },
  {
    content: "Good pacing and solid editing. Worth a rewatch!",
    author: "Lucas Jackson",
    date: "2025-05-05",
    time: "10:12",
    likes: 21,
    dislikes: 2,
  },
  {
    content: "Disappointed. The trailer made it look better than it was.",
    author: "Charlotte White",
    date: "2025-05-05",
    time: "11:26",
    likes: 6,
    dislikes: 10,
  },
  {
    content: "Super entertaining with a lot of unexpected turns.",
    author: "Henry Harris",
    date: "2025-05-05",
    time: "13:40",
    likes: 20,
    dislikes: 2,
  },
  {
    content: "Sound design was top-notch. Gave me chills!",
    author: "Amelia Martin",
    date: "2025-05-05",
    time: "15:18",
    likes: 17,
    dislikes: 1,
  },
  {
    content: "The message was powerful and timely. Well done.",
    author: "Jack Thompson",
    date: "2025-05-05",
    time: "16:52",
    likes: 23,
    dislikes: 0,
  },
  {
    content: "A bit slow in the beginning but picked up nicely.",
    author: "Harper Garcia",
    date: "2025-05-05",
    time: "17:43",
    likes: 15,
    dislikes: 2,
  },
  {
    content: "Didn't connect with the characters at all.",
    author: "Daniel Martinez",
    date: "2025-05-05",
    time: "18:31",
    likes: 4,
    dislikes: 7,
  },
  {
    content: "One of the best films I’ve seen this year. Highly recommend!",
    author: "Evelyn Robinson",
    date: "2025-05-05",
    time: "19:00",
    likes: 29,
    dislikes: 1,
  },
];

export const Reviews: ReviewType[] = [
  {
    title: "Unforgettable Cinematic Journey",
    content:
      "A thrilling experience from start to finish. The pacing kept me on edge, and every twist felt earned. I was completely hooked!",
    date: "2025-05-05",
    time: "20:15",
    rating: 8.7,
  },
  {
    title: "Visually Breathtaking",
    content:
      "Visual effects were stunning, especially the final battle scene. The detail and scope of the CGI made it feel like a real-world event.",
    date: "2025-05-05",
    time: "20:27",
    rating: 9.1,
  },
  {
    title: "Smart and Witty Dialogue",
    content:
      "The dialogue felt natural, with humor that never felt forced. Characters bounced off each other with believable chemistry.",
    date: "2025-05-05",
    time: "20:33",
    rating: 7.6,
  },
  {
    title: "Chilling Antagonist",
    content:
      "The villain was not just menacing but deeply complex. I found myself almost empathizing with their motives by the end.",
    date: "2025-05-05",
    time: "20:41",
    rating: 9.4,
  },
  {
    title: "Immersive World-Building",
    content:
      "Loved the setting—it felt alive and immersive. Every location had its own personality and added to the story's depth.",
    date: "2025-05-05",
    time: "20:49",
    rating: 8.2,
  },
  {
    title: "Exceptional Soundtrack",
    content:
      "The soundtrack enhanced every emotional beat. It's rare for music to be this effective without overshadowing the story.",
    date: "2025-05-05",
    time: "20:56",
    rating: 8.9,
  },
  {
    title: "Deep Character Growth",
    content:
      "Every character had an arc, and by the end, I felt like I'd witnessed real growth. It was emotionally satisfying.",
    date: "2025-05-05",
    time: "21:03",
    rating: 7.3,
  },
  {
    title: "Artistic Cinematography",
    content:
      "The cinematography was beautiful and meaningful. Many shots could stand alone as pieces of visual art.",
    date: "2025-05-05",
    time: "21:10",
    rating: 9.7,
  },
  {
    title: "Emotional Depth",
    content:
      "Had some powerful scenes that genuinely moved me. The emotional storytelling was grounded and impactful.",
    date: "2025-05-05",
    time: "21:18",
    rating: 8.5,
  },
  {
    title: "Creative and Bold",
    content:
      "A refreshingly original concept, executed with style. The risks it took paid off in building a truly unique story.",
    date: "2025-05-05",
    time: "21:25",
    rating: 9.0,
  },
  {
    title: "Relatable Hero's Journey",
    content:
      "It was easy to relate to the main character. Their personal struggles mirrored real life challenges in a powerful way.",
    date: "2025-05-05",
    time: "21:31",
    rating: 7.1,
  },
  {
    title: "Emotional Rollercoaster",
    content:
      "I laughed, I cried, and by the end I was emotionally drained—in the best way. Can’t wait to rewatch it!",
    date: "2025-05-05",
    time: "21:37",
    rating: 9.8,
  },
  {
    title: "Subtle and Thoughtful",
    content:
      "A strong message delivered without being preachy. The writing was graceful, and it left me thinking long after.",
    date: "2025-05-05",
    time: "21:42",
    rating: 9.3,
  },
  {
    title: "Instant Classic",
    content:
      "This feels like one of those films people will talk about for years. Everything from story to style just works.",
    date: "2025-05-05",
    time: "21:47",
    rating: 9.9,
  },
  {
    title: "Perfectly Paced",
    content:
      "Not a single dull moment. The story moved swiftly without rushing, and every scene had a purpose.",
    date: "2025-05-05",
    time: "21:52",
    rating: 7.8,
  },
  {
    title: "Heartfelt Storytelling",
    content:
      "A beautiful story told with genuine emotion. The cast and direction brought it to life with authenticity.",
    date: "2025-05-05",
    time: "21:58",
    rating: 10.0,
  },
  {
    title: "Surprising in the Best Way",
    content:
      "What I thought would be predictable ended up surprising me several times. A pleasant deviation from the norm.",
    date: "2025-05-05",
    time: "22:03",
    rating: 8.6,
  },
  {
    title: "Memorable Moments",
    content:
      "There’s one scene that still plays in my head—absolutely unforgettable. The emotional weight was huge.",
    date: "2025-05-05",
    time: "22:08",
    rating: 8.4,
  },
  {
    title: "Balanced and Bold",
    content:
      "Balanced action with emotional depth. It never felt one-dimensional, and that’s what makes it so compelling.",
    date: "2025-05-05",
    time: "22:14",
    rating: 8.8,
  },
  {
    title: "Satisfying Conclusion",
    content:
      "A perfect ending to a gripping story. It wrapped everything up in a way that felt earned and rewarding.",
    date: "2025-05-05",
    time: "22:19",
    rating: 9.5,
  },
];

// partners
export const partners = [
  "/website/partners/3docean-light-background.png",
  "/website/partners/activeden-light-background.png",
  "/website/partners/audiojungle-light-background.png",
  "/website/partners/codecanyon-light-background.png",
  "/website/partners/photodune-light-background.png",
  "/website/partners/themeforest-light-background.png",
  "/website/partners/codecanyon-light-background.png",
  "/website/partners/photodune-light-background.png",
  "/website/partners/codecanyon-light-background.png",
];

// about
const iconStyle = "size-10 text-accent";
export const cards = [
  {
    number: "01",
    title: "Choose your Plan",
    content:
      "Find the perfect experience for your movie nights. From individual streaming to full theater-at-home features, choose the plan that fits your cinematic lifestyle.",
  },
  {
    number: "02",
    title: "Create an account",
    content:
      "Join our global community of film enthusiasts in seconds. Set up your profile, preferences, and start building your ultimate cinematic watchlist today.",
  },
  {
    number: "03",
    title: "Enjoy FlickHQ",
    content:
      "Dive into an immersive world of 4K entertainment. Experience movies the way they were meant to be seen, with premium quality and personalized discovery.",
  },
];

export const FeaturesCards = [
  {
    title: "Cinematic Library",
    content:
      "Explore a curated collection of thousands of 4K movies, exclusive series, and award-winning documentaries across every genre imaginable.",
    icon: <TiBook className={`${iconStyle}`} />,
  },
  {
    title: "Digital Premieres",
    content:
      "Get front-row access to the latest blockbusters and independent premieres with our digital ticket system for exclusive virtual screenings.",
    icon: <TbTicket className={`${iconStyle}`} />,
  },
  {
    title: "Interactive Events",
    content:
      "Experience films together with synchronized screenings, live community chats, and real-time polls during exclusive event windows.",
    icon: <PiScreencastBold className={`${iconStyle}`} />,
  },
  {
    title: "Lossless Streaming",
    content:
      "Witness every detail with HDR10+ and Dolby Atmos support. Our adaptive bitrate technology ensures a seamless 4K experience even on slower connections.",
    icon: <FaStream className={`${iconStyle}`} />,
  },
  {
    title: "AI Discovery",
    content:
      "Our sophisticated neural engine learns your cinematic tastes to provide deeply personal recommendations that go beyond simple genre matching.",
    icon: <MdRecommend className={`${iconStyle}`} />,
  },
  {
    title: "Universal Offline",
    content:
      "Take your cinema with you. Download any title in full quality and watch anywhere, from transcontinental flights to remote getaways.",
    icon: <PiDownloadBold className={`${iconStyle}`} />,
  },
  {
    title: "Pro Parental Suite",
    content:
      "Create safe spaces for young viewers with granular age-based filtering, usage monitoring, and custom profile restrictions for every family member.",
    icon: <RiParentFill className={`${iconStyle}`} />,
  },
  {
    title: "Omni-Channel Sync",
    content:
      "Start on your phone, continue on your tablet, and finish on your Smart TV. Your progress and preferences stay perfectly synced across all devices.",
    icon: <MdOutlineDevicesOther className={`${iconStyle}`} />,
  },
];
