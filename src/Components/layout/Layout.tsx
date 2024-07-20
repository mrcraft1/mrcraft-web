import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { darkTheme, lightTheme } from "../../Theme";
import { Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./Header/Header";
import { LayoutProps } from "../../typescriptTypes/globalTypes";

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const storedDarkMode = localStorage.getItem("darkMode");
        if (storedDarkMode) {
            setDarkMode(storedDarkMode === "true");
        }
    }, []);

    const handleChangeLight = (): void => {
        setDarkMode(false);
        localStorage.setItem("darkMode", "false");
    };

    const handleChangeDark = (): void => {
        setDarkMode(true);
        localStorage.setItem("darkMode", "true");
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <Paper>
                <Header
                    check={darkMode}
                    changeLight={handleChangeLight}
                    changeDark={handleChangeDark}
                />
                <div className="layout-style">{children}</div>
                <Footer />
            </Paper>
        </ThemeProvider>
    );
};

export default Layout;