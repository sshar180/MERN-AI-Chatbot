import { Link } from "react-router-dom";

import styles from "./Logo.module.css";
import logo from "/logos/logo.png";

const Logo = () => {
	return (
		<div className={styles.parent}>
				<Link to={"/"} className={styles.logo}>
					<img src={logo} alt='logo' className={styles.logo} />
				</Link>
		</div>
	);
};

export default Logo;
