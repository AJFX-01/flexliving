const rules: string[] = ["Check-in: 3 pm", "Pets: not allowed", "Check-out: 10 am", "Smoking inside: not allowed" ];

const imageURLs = [
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-SfTV9--CrlCv9---rP7uE5bSGCBJDCLTyaNLhH1NZ1B5k-68e64c0550cf3?width=1280&quality=70&format=webp&v=2",,
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-fywtCWHTiP-VXqNKyG4230oSaFqnTVdO1CHe6d3YqZ8-68e64c0aebc5a?width=1280&quality=70&format=webp&v=2",
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-Vnc7ic9YqxIzLBgNPT1rUb5Qru-C0bm2fD2FWgj5mIs-68e64c32ee29d?width=1280&quality=70&format=webp&v=2",
  "https://bookingenginecdn.hostaway.com/listing/23248-79029-UvhHHGf--3miRxJJERsngMWZf9nHGJ4kiUousFFKKpmE-68e64c4237dc0?width=1280&quality=70&format=webp&v=2",
]

const statusFilterItems: { [key: string]: string } = {
  "all": "All Status",
  "approved": "Approved",
  "pending": "Pending",
  "rejected": "Rejected",
}

const sourceFilterItems: { [key: string]: string } = {
  "all": "All Source",
  "hostaway": "Hostaway",
  "google": "Google",
}

const ratingFilterItems: { [key: string]: string } = {
  'newest': 'Newest',
  'highest-rating': 'Lowest Rating',
  'lowest-rating': 'Highest Rating'
}


const otherSpecRate: string[] = [
  "respect house rules", "communication", "respect house rules", "accuracy", "cleanliness"
]


export const constantUtils = {
  rules,
  imageURLs,
  statusFilterItems,
  sourceFilterItems,
  ratingFilterItems,
  otherSpecRate

}