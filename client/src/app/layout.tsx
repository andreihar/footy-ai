"use client";
import { styled, Container, Box, ThemeProvider, CssBaseline } from "@mui/material";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import React, { useState } from "react";
import { StatsProvider } from "@/utils/StatsContext";
import { LanguageProvider, useLanguage } from '@/utils/LanguageProvider';
import Header from "@/app/layout/header/Header";
import Sidebar from "@/app/layout/sidebar/Sidebar";


const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "#EDEFF4",
}));



export default function RootLayout({ children }: { children: React.ReactNode; }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <StatsProvider>
          <ThemeProvider theme={baselightTheme}>
            <LanguageProvider>
              <CssBaseline />
              <MainWrapper className="mainwrapper">
                {/* <Sidebar
                isSidebarOpen={isSidebarOpen}
                isMobileSidebarOpen={isMobileSidebarOpen}
                onSidebarClose={() => setMobileSidebarOpen(false)}
              /> */}
                <PageWrapper className="page-wrapper">
                  <Header />
                  <Container
                    sx={{
                      paddingTop: "20px",
                      maxWidth: "1200px",
                    }}
                  >
                    <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
                  </Container>
                </PageWrapper>
              </MainWrapper>
            </LanguageProvider>
          </ThemeProvider>
        </StatsProvider>
      </body>
    </html>
  );
}
