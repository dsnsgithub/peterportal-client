'use client';
import { FC, useRef, useEffect } from 'react';
import './RoadmapPage.scss';
import Planner from './planner/Planner';
import SearchSidebar from './sidebar/SearchSidebar';
import { useAppSelector } from '../../store/hooks';
import AddCoursePopup from './planner/AddCoursePopup';
import { useIsMobile } from '../../helpers/util';
import { CSSTransition } from 'react-transition-group';
import TransferCreditsMenu from './transfers/TransferCreditsMenu';
import { useSaveRoadmap } from '../../hooks/planner';
import { useIsLoggedIn } from '../../hooks/isLoggedIn';

const RoadmapPage: FC = () => {
  const showSearch = useAppSelector((state) => state.roadmap.showSearch);
  const isMobile = useIsMobile();
  const sidebarRef = useRef(null);
  const saveRoadmap = useSaveRoadmap();
  const isLoggedIn = useIsLoggedIn();
  const currentRevisionIndex = useAppSelector((state) => state.roadmap.currentRevisionIndex);
  const savedRevisionIndex = useAppSelector((state) => state.roadmap.savedRevisionIndex);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (currentRevisionIndex === savedRevisionIndex) return;

    const timeoutId = setTimeout(() => {
      saveRoadmap(false); // false = don't show toast notifications
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [currentRevisionIndex, savedRevisionIndex, isLoggedIn, saveRoadmap]);

  return (
    <>
      <div className="roadmap-page">
        <AddCoursePopup />
        <div className={`main-wrapper ${isMobile ? 'mobile' : ''}`}>
          <Planner />
        </div>
        <CSSTransition in={!isMobile || showSearch} timeout={500} unmountOnExit nodeRef={sidebarRef}>
          <SearchSidebar sidebarRef={sidebarRef} />
        </CSSTransition>
        {isMobile && <TransferCreditsMenu />}
      </div>
    </>
  );
};

export default RoadmapPage;
