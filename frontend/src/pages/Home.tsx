// import React from "react";
// import styles from "./Home.module.css";
// import botIcon from "/logos/AI.png";

// const Home = () => {
//   return (
//     <div className={styles.top}>
//       <div className={styles.d1}>
//         <h1>About MyGPT</h1>
//         MyGPT is a robust language model designed to aid you in diverse tasks and participate in seamless, natural conversations. Whether you wish to initiate a new dialogue or pick up from where you previously left off, feel free to ask questions on any topic. My aim is to provide assistance and engage in meaningful interactions tailored to your needs. As you explore my capabilities, I hope you find the information and support you seek.
//       </div>
//       <div className={styles.d2}>
//         <img src={botIcon}></img>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./Home.module.css";
import botIcon from "/logos/AI.png";

const Home = () => {
  const textControls = useAnimation();
  const imageControls = useAnimation();

  useEffect(() => {
    // Animation for text
    textControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    });

    // Animation for image
    imageControls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    });
  }, [textControls, imageControls]);

  return (
    <div className={styles.top}>
      <div className={styles.d1}>
        <motion.h1 animate={textControls} initial={{ opacity: 0, y: "1em" }}>
          About MyGPT
        </motion.h1>
        <motion.p animate={textControls} initial={{ opacity: 0, y: "1em" }}>
          MyGPT is a robust language model designed to aid you in diverse tasks
          and participate in seamless, natural conversations. Whether you wish
          to initiate a new dialogue or pick up from where you previously left
          off, feel free to ask questions on any topic. My aim is to provide
          assistance and engage in meaningful interactions tailored to your
          needs. As you explore my capabilities, I hope you find the information
          and support you seek.
        </motion.p>
      </div>
      <div className={styles.d2}>
        <motion.img
          src={botIcon}
          alt="Bot Icon"
          animate={imageControls}
          initial={{ opacity: 0, x: "-1em" }}
        />
      </div>
    </div>
  );
};

export default Home;
