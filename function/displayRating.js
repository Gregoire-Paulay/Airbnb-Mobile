import { Ionicons } from "@expo/vector-icons";

const displayRating = (rate) => {
  const tab = [];

  for (let i = 1; i <= 5; i++) {
    // console.log(i);
    if (i <= rate) {
      tab.push(<Ionicons name="star" size={20} color="orange" key={i} />);
    } else {
      tab.push(<Ionicons name="star" size={20} color="gray" key={i} />);
    }
  }

  // console.log(tab);
  return tab;
};

export default displayRating;
