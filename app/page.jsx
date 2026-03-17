import { PortfolioNavbar } from 'components/portfolio-navbar';
import { PortfolioHero } from 'components/portfolio-hero';
import { PortfolioAbout } from 'components/portfolio-about';
import { PortfolioExperience } from 'components/portfolio-experience';
import { PortfolioParallax } from 'components/portfolio-parallax';
import { PortfolioProjects } from 'components/portfolio-projects';

export default function Page() {
    return (
        <div className="relative min-h-screen">
            <PortfolioNavbar />
            <main>
                <PortfolioHero />
                <PortfolioAbout />
                <PortfolioExperience />
                <PortfolioParallax />
                <PortfolioProjects />
            </main>
        </div>
    );
}
