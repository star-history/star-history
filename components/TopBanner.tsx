import React, { useState, useEffect, ChangeEvent } from 'react';

const TopBanner: React.FC = () => {
    const [personalAccessToken, setPersonalAccessToken] = useState('');
    const [starCount, setStarCount] = useState<number | null>(null);
  
    useEffect(() => {
      const fetchStarCount = async () => {
        try {
          const response = await fetch(
            'https://api.github.com/repos/star-history/star-history'
          );
  
          if (response.ok) {
            const data = await response.json();
            if (data.stargazers_count) {
              setStarCount(data.stargazers_count);
            }
          }
        } catch (error) {
          console.error('Error fetching star count:', error);
        }
      };
  
      fetchStarCount();
    }, []);
  
    const handleAccessTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
      setPersonalAccessToken(event.target.value);
    };
  
    return (
        <nav>
  
 <div className="flex justify-center items-center gap-x-6 bg-green-600 px-6 py-1 sm:px-3.5 "
  >
    <p className="text-sm leading-6 text-white">
      <a href="https://stars.github.com/nominate/" target="_blank">
        🙋 Help out - Please take 2 mins to nominate our curator @milasuperstar
        to become a GitHub Star
      </a>
    </p>
  </div>
  
      </nav>
    );
  };
  
  export default TopBanner;