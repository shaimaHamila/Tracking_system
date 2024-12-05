import { Drawer } from "antd";
import { useEffect, useState } from "react";

interface DrawerComponentProps {
  /**
   * Is the modal open?
   * @default false
   * */
  isOpen: boolean;

  /**
   * Function to close the modal
   * */
  handleClose: () => void;
  /**
   * The title of the modal
   * */
  title: string;

  /**
   * The content of the modal
   * */
  content: React.ReactNode;
}
const DrawerComponent: React.FC<DrawerComponentProps> = ({ isOpen, handleClose, content, title }) => {
  const [drawerWidth, setDrawerWidth] = useState("60%");

  useEffect(() => {
    // Function to handle resize and set width accordingly
    const handleResize = () => {
      setDrawerWidth(window.innerWidth < 800 ? "100%" : "60%");
    };

    // Initial check
    handleResize();

    // Event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Drawer
      title={title}
      width={drawerWidth}
      open={isOpen}
      onClose={handleClose}
      destroyOnClose={true}
      styles={{
        body: {
          backgroundColor: "#F5F5F5",
          paddingBottom: 50,
        },
      }}
    >
      {content}
    </Drawer>
  );
};

export default DrawerComponent;
