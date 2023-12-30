import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppStore } from '../store';
import utils from '../common/utils';
import { convertDataToChartData, getRepoData } from '../common/chart';
import api from '../common/api';
import toast from '../helpers/toast';
import { XYChartData } from '../packages/xy-chart';
import BytebaseBanner from './SponsorView';
import StarXYChart from './Charts/StarXYChart';
import TokenSettingDialog from './TokenSettingDialog';
import GenerateEmbedCodeDialog from './GenerateEmbedCodeDialog';
import EmbedChartGuideDialog from './EmbedChartGuideDialog';

interface RepoData {
  repo: string;
  starRecords: { date: string; count: number }[];
  logoUrl: string;
}

interface TokenSettingDialogProps {
  show: boolean;
  onClose: () => void;
}

interface State {
  chartMode: 'Date' | 'Timeline';
  repoCacheMap: Map<string, { starData: { date: string; count: number }[]; logoUrl: string }>;
  chartData?: XYChartData;
  isGeneratingImage: boolean;
  showSetTokenDialog: boolean;
  showGenEmbedCodeDialog: boolean;
  showEmbedChartGuideDialog: boolean;
}

const ChartPage: React.FC = () => {
  const router = useRouter();
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const [yourEmbedCodeVariable, setYourEmbedCodeVariable] = useState<string>('');
  const store = useAppStore();

  const state: State = {
    chartMode: 'Date',
    repoCacheMap: new Map(),
    chartData: undefined,
    isGeneratingImage: false,
    showSetTokenDialog: false,
    showGenEmbedCodeDialog: false,
    showEmbedChartGuideDialog: false,
  };

  const isFetching = utils.computed(() => {
    return store.isFetching;
  });

  const chartMode = utils.computed(() => {
    return store.chartMode;
  });

  useEffect(() => {
    if (store.repos.length > 0) {
      fetchReposData(store.repos);
    }
  }, []);

  useEffect(() => {
    fetchReposData(store.repos);
  }, [store.repos]);

  const fetchReposData = async (repos: string[]) => {
    store.isFetching(true);
    const notCachedRepos: string[] = [];

    for (const repo of repos) {
      const cachedRepo = state.repoCacheMap.get(repo);

      if (!cachedRepo) {
        notCachedRepos.push(repo);
      }
    }

    try {
      const data = await getRepoData(notCachedRepos, store.token);
      for (const { repo, starRecords, logoUrl } of data) {
        state.repoCacheMap.set(repo, {
          starData: starRecords,
          logoUrl,
        });
      }
    } catch (error: any) {
      toast.warn(error.message);

      if (error.status === 401 || error.status === 403) {
        state.showSetTokenDialog = true;
      } else if (error.status === 404 || error.status === 501) {
        store.delRepo(error.repo);
      }
    }
    store.isFetching(false);

    const repoData: RepoData[] = [];
    for (const repo of repos) {
      const cachedRepo = state.repoCacheMap.get(repo);
      if (cachedRepo) {
        repoData.push({
          repo,
          starRecords: cachedRepo.starData,
          logoUrl: cachedRepo.logoUrl,
        });
      }
    }

    if (repoData.length === 0) {
      state.chartData = undefined;
    } else {
      state.chartData = convertDataToChartData(repoData, chartMode.value);
    }
  };

  const handleCopyLinkBtnClick = async () => {
    await utils.copyTextToClipboard(window.location.href);
    toast.succeed('Link copied');
  };

  const handleGenerateImageBtnClick = async () => {
    if (state.isGeneratingImage) {
      return;
    }

    const svgElement = containerElRef.current?.querySelector('svg')?.cloneNode(true) as SVGSVGElement;
    svgElement.querySelectorAll('.chart-tooltip-dot').forEach((d) => d.remove());

    for (const i of Array.from(svgElement.querySelectorAll('image'))) {
      const url = i.getAttribute('href');
      if (url) {
        const dataUrl = await utils.getBase64Image(url);
        i.setAttribute('href', dataUrl);
      }
    }

    svgElement.setAttribute('class', 'fixed -z-10');
    document.body.append(svgElement);

    if (!svgElement || !containerElRef.current) {
      toast.warn('Chart element not found, please try later');
      return;
    }

    state.isGeneratingImage = true;

    let destoryGeneratingToast = () => {};
    setTimeout(() => {
      if (state.isGeneratingImage) {
        const cbs = toast.warn(
          `<i class="fas fa-spinner animate-spin text-2xl mr-3"></i>Generating image`,
          -1
        );
        destoryGeneratingToast = cbs.destroy;
      }
    }, 2000);

    try {
      const { width: imgWidth, height: imgHeight } = containerElRef.current.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const scale = Math.floor(window.devicePixelRatio * 2);
      canvas.width = (imgWidth + 20) * scale;
      canvas.height = (imgHeight + 30) * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.warn('Get canvas context failed.');
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const chartDataURL = utils.convertSVGToDataURL(svgElement);
      const chartImage = new Image();
      chartImage.src = chartDataURL;
      await utils.waitImageLoaded(chartImage);
      ctx.drawImage(chartImage, 10 * scale, 10 * scale, imgWidth * scale, imgHeight * scale);

      const link = document.createElement('a');
      link.download = `star-history-${utils.getDateString(Date.now(), 'yyyyMMdd')}.png`;
      link.href = canvas.toDataURL();
      link.click();
      state.isGeneratingImage = false;
      destoryGeneratingToast();
      toast.succeed('Image Downloaded');
    } catch (error) {
      console.error(error);
      toast.error('Generate image failed');
    }

    svgElement.remove();
  };

  const handleExportAsCSVBtnClick = () => {
    let CSVContent = '';
    for (const repo of store.repos) {
      const records = state.repoCacheMap.get(repo)?.starData;
      if (records) {
        const temp: any[] = [];
        for (const i of records) {
          temp.push([repo, new Date(i.date), i.count]);
        }
        CSVContent += temp
          .map((item) => (typeof item === 'string' && item.indexOf(',') >= 0 ? `"${item}"` : String(item)))
          .join('\n');
        CSVContent += '\n';
      }
    }

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + CSVContent);
    const link = document.createElement('a');
    link.download = `star-history-${utils.getDateString(Date.now(), 'yyyyMMdd')}.csv`;
    link.href = encodedUri;
    link.click();
    toast.succeed('CSV Downloaded');
  };

  const handleShareToTwitterBtnClick = async () => {
    const repos = store.repos;
    if (repos.length === 0) {
      toast.error('No repo found');
      return;
    }

    const starhistoryLink = encodeURIComponent(window.location.href);
    let text = '';

    if (repos.length === 1) {
      const repo = repos[0];
      let starCount = 0;

      try {
        starCount = await api.getRepoStargazersCount(repo, store.token);
      } catch (error) {
        // do nth
      }

      let starText = '';
      if (starCount > 0) {
        starText = `${
          (starCount < 1000 ? starCount : (starCount / 1000).toFixed(1) + 'K') + ' ⭐️ '
        }`;
      }
      text = `${starText}Thank you! 🙏%0A${starhistoryLink}%0A%0A`;
    } else {
      text = repos.join(' vs ') + '%0A%0A';
    }

    const addtionLink = repos.length === 1 ? `github.com/${repos[0]}` : starhistoryLink;
    text += `${addtionLink}%0A%0A`;
    text += `${encodeURIComponent('#starhistory #GitHub #OpenSource ')}`;
    const tweetShareLink = `https://twitter.com/intent/tweet?text=${text}%0A&via=StarHistoryHQ`;
    const link = document.createElement('a');
    link.href = tweetShareLink;
    link.target = '_blank';
    link.click();
  };

  const handleGenEmbedCodeDialogBtnClick = () => {
    state.showGenEmbedCodeDialog = true;
  };

  const handleGenEmbedCodeDialogClose = () => {
    state.showGenEmbedCodeDialog = false;
  };

  const handleToggleChartBtnClick = () => {
    store.chartMode(chartMode.value === 'Date' ? 'Timeline' : 'Date');
    fetchReposData(store.repos);
  };

  const handleSetTokenDialogClose = () => {
    state.showSetTokenDialog = false;
  };

  return (
    <>

    </>
  );
};

export default ChartPage;
