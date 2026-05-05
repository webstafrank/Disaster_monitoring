"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  LineChart, 
  Map as MapIcon, 
  ShieldAlert, 
  Sprout, 
  Layers,
  ArrowRight,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { OutcomesSlider } from "./_components/outcomes-slider";

const heroImages = [
    {
        src: "/231107.jpg",
        alt: "Kenya Landscape 1",
    },
    {
        src: "/88112.jpg",
        alt: "Kenya Landscape 2",
    },
    {
        src: "/iStock-1077574640.avif",
        alt: "Kenya Landscape 3",
    },
];

const keyFeatures = [
    {
        title: "Integrated map workspace",
        description: "Access real-time satellite imagery and GeoServer-delivered map layers in a single unified interface.",
        icon: MapIcon,
    },
    {
        title: "Study-driven analysis",
        description: "Leverage advanced geospatial analysis to monitor land cover shifts and environmental changes.",
        icon: Target,
    },
    {
        title: "Decision-ready summaries",
        description: "Generate comprehensive reports and charts to support data-driven decision making for disaster response.",
        icon: BarChart3,
    },
];

const impacts = [
    {
        title: "Land Cover Shifts",
        description: "Reveal land cover shifts that may intensify resource pressure or flood exposure.",
        icon: Layers,
    },
    {
        title: "Vegetation Health",
        description: "Track vegetation health and seasonal recovery using geospatial raster products.",
        icon: Sprout,
    },
    {
        title: "Early Drought Warning",
        description: "Identify drought stress zones early with map layers and chart-based thresholds.",
        icon: ShieldAlert,
    },
];

const collaborators = [
    {
        name: "Kenya Space Agency",
        role: "Strategic Partner"
    },
    {
        name: "World Food Programme",
        role: "Implementation Lead"
    },
    {
        name: "Remote Sensing Lab",
        role: "Technical Partner"
    },
    {
        name: "Water Authority",
        role: "Data Custodian"
    }
];

const spatialCommandLogos = [
    {
        name: "Kenya Space Agency",
        src: "/ksa.PNG",
    },
    {
        name: "World Food Programme",
        src: "/wfp.PNG",
    },
];

export default function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-[var(--line)]">
                <div className="grid gap-0 lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-strong)] w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]"></span>
                            </span>
                            Mission Overview
                        </div>
                        
                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl text-[var(--foreground)]">
                            Disaster Monitoring & <span className="text-[var(--secondary)]">Drought Indicators</span>
                        </h1>
                        
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                            A comprehensive framework for Kenya&apos;s disaster monitoring. 
                            Harnessing geospatial intelligence to protect ecosystems and communities 
                            through data-driven insights.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                href="/map-frame"
                                className="group flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[var(--accent)] hover:shadow-lg hover:shadow-[color:rgba(23,78,166,0.2)]"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                View Dashboard
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/reports"
                                className="flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-transparent px-8 py-4 text-sm font-bold transition-all hover:border-[var(--accent)] hover:bg-[var(--surface-strong)]"
                            >
                                <LineChart className="h-4 w-4 text-[var(--accent)]" />
                                See Insights
                            </Link>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[var(--line)] pt-8">
                            <div>
                                <p className="text-3xl font-bold text-[var(--accent-strong)]">12</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">Regions</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-[var(--secondary)]">24</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">Layers</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-[var(--warning)]">03</p>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">Indicators</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden min-h-[500px] lg:block overflow-hidden">
                        {heroImages.map((image, index) => (
                            <div
                                key={image.src}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    index === currentSlide ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    priority={index === 0}
                                    className="object-cover"
                                />
                            </div>
                        ))}
                        
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,white_0%,rgba(255,255,255,0.72)_25%,rgba(23,78,166,0.28)_58%,rgba(109,59,191,0.44)_100%)] mix-blend-multiply" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
                        
                        {/* Slider Controls */}
                        <div className="absolute bottom-8 left-8 flex gap-2">
                            <button 
                                onClick={prevSlide}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Floating Insight Card */}
                        <div className="absolute bottom-8 right-8 max-w-xs rounded-2xl bg-white/90 p-5 backdrop-blur-md border border-white/20 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--secondary-soft)] text-[var(--secondary)]">
                                    <MapIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Spatial Intelligence</p>
                                    <p className="text-xs text-slate-500">Live GeoServer Feed</p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-slate-600">
                                Real-time integration with satellite-derived products for rapid situational awareness.
                            </p>
                            <div className="mt-4 border-t border-slate-200/80 pt-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                    Spatial Command
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    {spatialCommandLogos.map((logo) => (
                                        <div
                                            key={logo.name}
                                            className="flex h-12 w-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm"
                                        >
                                            <Image
                                                src={logo.src}
                                                alt={logo.name}
                                                width={80}
                                                height={32}
                                                className="max-h-8 w-auto object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="space-y-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight">Core Capabilities</h2>
                    <p className="mt-4 text-slate-600">
                        Our platform provides specialized tools for environmental monitoring 
                        and disaster risk reduction across the Kenyan landscape.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {keyFeatures.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-3xl border border-[var(--line)] bg-white p-8 transition-all hover:border-[var(--accent-soft)] hover:shadow-xl hover:shadow-[color:rgba(0,0,0,0.03)]"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent-soft)]">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                            <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Insights / Impacts Section */}
            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[2.5rem] bg-[var(--secondary-strong)] p-10 text-white overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Impact Analysis</p>
                        <h2 className="mt-4 text-3xl font-bold">Why this dashboard matters</h2>
                        <p className="mt-6 text-white/80 leading-relaxed">
                            Data-driven decision making is critical for climate resilience. 
                            We provide the tools to translate raw spatial data into actionable environmental policy.
                        </p>
                        
                        <div className="mt-10 space-y-4">
                            {impacts.map((impact) => (
                                <div
                                    key={impact.title}
                                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                        <impact.icon className="h-5 w-5 text-[var(--secondary-soft)]" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{impact.title}</p>
                                        <p className="mt-1 text-sm text-white/70 leading-relaxed">
                                            {impact.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex-1 rounded-[2.5rem] border border-[var(--line)] bg-white p-10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Collaborators</p>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance">Institutional Partners</h2>
                        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                            Collaborative effort between national and regional entities ensuring 
                            technical accuracy and operational relevance.
                        </p>
                        
                        <div className="mt-8 grid gap-4 sm:grid-cols-1">
                            {collaborators.map((collaborator) => (
                                <div
                                    key={collaborator.name}
                                    className="flex items-center gap-4 rounded-2xl bg-[var(--surface-strong)] p-4 border border-transparent hover:border-[var(--line)] transition-all"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white font-bold text-[var(--accent)] uppercase tracking-tighter shadow-sm">
                                        {collaborator.name.split(" ").map(w => w[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{collaborator.name}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">{collaborator.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="rounded-[2.5rem] bg-[var(--accent-soft)] p-8 flex items-center justify-between">
                        <div>
                            <p className="font-bold text-[var(--accent-strong)] text-balance">Need customized reports?</p>
                            <p className="text-sm text-[var(--accent)] mt-1">Our team can help with specific area studies.</p>
                        </div>
                        <Link href="/reports" className="h-12 w-12 flex items-center justify-center rounded-full bg-white text-[var(--accent-strong)] shadow-sm hover:scale-110 transition-transform">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Expected Outcomes Slider */}
            <section className="pt-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Project Expected Outcomes</h2>
                    <p className="mt-2 text-slate-600">Discover the long-term impact and strategic goals of our disaster monitoring initiatives.</p>
                </div>
                <OutcomesSlider />
            </section>
        </div>
    );
}
