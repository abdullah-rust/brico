import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./DesignCarousel.module.css";
import { useNavigate } from "react-router-dom";

const designs = [
  {
    id: 1,
    title: "Modern 2-Story Plans",
    desc: "3 Bed, 2 Bath • 1500 sqft",
    tag: "Top Rated",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400",
  },
  {
    id: 2,
    title: "Building Elevations",
    desc: "Front & Side Views",
    tag: null,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400",
  },
  {
    id: 3,
    title: "Interior Styles",
    desc: "Minimalist & Classic",
    tag: null,
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400",
  },
];

const DesignCarousel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Explore Designs</h3>
        <button className={styles.seeAll} onClick={() => navigate("/designs")}>
          See all
        </button>
      </div>

      <Swiper
        spaceBetween={16}
        slidesPerView={"auto"} // Taake cards ki width CSS se control ho
        nested={true} // <--- Sab se important line!
        className={styles.carouselSwiper}
      >
        {designs.map((item) => (
          <SwiperSlide key={item.id} className={styles.cardSlide}>
            <div className={styles.card}>
              <div
                className={styles.imageWrapper}
                style={{ backgroundImage: `url(${item.img})` }}
              >
                {item.tag && <span className={styles.tag}>{item.tag}</span>}
                <div className={styles.overlay} />
              </div>
              <h4 className={styles.title}>{item.title}</h4>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default DesignCarousel;
