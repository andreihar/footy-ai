'use client';
import { styled, Container, Box } from "@mui/material";
import DynamicTheme from "@/utils/DynamicTheme";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import '@/app/[locale]/global.css';

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

export default function ClientLayout({ children }: { children: React.ReactNode; }) {
  return (
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
  );
}
