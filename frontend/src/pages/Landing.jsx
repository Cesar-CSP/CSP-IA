import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import AutomationGrid from "@/components/AutomationGrid";
import Agents247 from "@/components/Agents247";
import Services from "@/components/Services";
import ChatDemo from "@/components/ChatDemo";
import Industries from "@/components/Industries";
import Process from "@/components/Process";
import Benefits from "@/components/Benefits";
import WhyUs from "@/components/WhyUs";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

const Landing = () => {
    const location = useLocation();

    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        let rafId;
        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        const onClick = (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;
            const hash = anchor.getAttribute("href");
            if (hash && hash.length > 1) {
                const el = document.querySelector(hash);
                if (el) {
                    e.preventDefault();
                    lenis.scrollTo(el, { offset: -72, duration: 1.2 });
                }
            }
        };
        document.addEventListener("click", onClick);
        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener("click", onClick);
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo(0, 0);
            return;
        }
        const el = document.querySelector(location.hash);
        if (el) {
            const timer = setTimeout(() => {
                window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72 });
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [location.hash]);

    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Marquee />
                <AutomationGrid />
                <Agents247 />
                <Services />
                <ChatDemo />
                <Industries />
                <Process />
                <Benefits />
                <WhyUs />
                <LeadForm />
            </main>
            <Footer />
        </>
    );
};

export default Landing;
