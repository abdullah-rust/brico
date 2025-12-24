import React from "react";
import { MdSearch } from "react-icons/md";
import styles from "./SearchBar.module.css";

const SearchBar: React.FC = () => (
  <div className={styles.wrapper}>
    <div className={styles.bar}>
      <MdSearch size={22} color="#94a3b8" />
      <input
        type="text"
        placeholder="Search workers, tools..."
        className={styles.input}
      />
    </div>
  </div>
);

export default SearchBar;
