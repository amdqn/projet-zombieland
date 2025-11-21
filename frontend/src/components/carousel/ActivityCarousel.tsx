import { ActivityCard } from '../cards/ActivityCard';
import { Carousel } from './Carousel';

interface Activity {
  id: number;
  name: string;
  category: string;
  images: string[];
}

interface ActivityCarouselProps {
  activities: Activity[];
}

export const ActivityCarousel = ({ activities }: ActivityCarouselProps) => {
  const items = activities.map((activity) => (
    <ActivityCard
      key={activity.id}
      id={activity.id}
      name={activity.name}
      category={activity.category}
      image={activity.images?.[0]}
    />
  ));

  return <Carousel items={items} />;
};
