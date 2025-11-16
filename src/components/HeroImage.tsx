'use client'

export default function HeroImage() {
  return (
    <div className="relative">
      <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
        <div className="aspect-[5/4] relative">
          {/* Main image - Replace src with your image URL */}
          <img 
            src="/hult-main.jpg" 
            alt="Hult Prize KCE" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback gradient if image doesn't exist
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="hidden absolute inset-0 bg-gradient-to-br from-primary-light via-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm">
            Hult Prize KCE
          </div>
        </div>
        
        {/* Floating circular images */}
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-xl">
          <img 
            src="/team-badge.jpg" 
            alt="Team" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-xs text-white font-bold">
            Team
          </div>
        </div>
        <div className="absolute top-1/3 left-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-xl">
          <img 
            src="/event-badge.jpg" 
            alt="Event" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-xs text-white font-bold">
            Event
          </div>
        </div>
        <div className="absolute bottom-24 left-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-xl">
          <img 
            src="/impact-badge.jpg" 
            alt="Impact" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-xs text-white font-bold">
            Impact
          </div>
        </div>
      </div>
    </div>
  )
}
