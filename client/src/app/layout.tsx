"use client";
import { styled, Container, Box } from "@mui/material";
import React, { Suspense } from "react";
import { StatsProvider } from "@/utils/StatsContext";
import { LanguageProvider } from '@/utils/LanguageProvider';
import DynamicTheme from "@/utils/DynamicTheme";
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";
import Loading from './loading';
import './global.css';

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "#EDEFF4",
}));

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          <StatsProvider>
            <LanguageProvider>
              <DynamicTheme>
                <MainWrapper className="mainwrapper">
                  <PageWrapper className="page-wrapper">
                    <Header />
                    <Container sx={{ paddingTop: "20px", paddingBottom: "60px", maxWidth: "1200px" }}>
                      <Box sx={{ minHeight: "calc(100vh - 228px)" }}>{children}</Box>
                    </Container>
                    <Footer />
                  </PageWrapper>
                </MainWrapper>
              </DynamicTheme>
            </LanguageProvider>
          </StatsProvider>
        </Suspense>
      </body>
    </html>
  );
}
