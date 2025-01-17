import { Avatar, Checkbox, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { useMusicPlayerContext } from '@components/seed/24/music-player/MusicPlayerContext';
import { useMemo, useRef, useState } from 'react';
import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import * as gtag from '@components/adsense/lib/gtag';
import { isProduction } from '@tools/helper';

interface MusicItemProps {
    src: string;
    label: string;
    icon: string;
    hint: string;
}


const MusicItem = (props: MusicItemProps) => {
    const { i18n } = useTranslation();
    const { label, src, icon, hint } = props;
    const { setTrack, onClip, track, state, setState, preference } = useMusicPlayerContext();
    const buttonRef = useRef<HTMLDivElement>(null);
    const isSelected = useMemo(() => track?.name === label, [track, label]);
    const isPlaying = useMemo(() => state === 'playing', [state]);
    const check = preference.check;

    const [isPlayed, setIsPlayed] = useState<boolean>(false);

    const togglePlay = () => {
        if (buttonRef.current) {
            buttonRef.current.blur();
        }
        if (isSelected) {
            setState(isPlaying ? 'paused' : 'playing');
        } else {
            setTrack({ name: label, src, coverImg: icon, hint });
            if (isProduction) {
                gtag.event({
                    action: 'seed-24-play',
                    label,
                });
            }
            if (preference.autoClip) {
                onClip(label);
            }
        }
    };

    return useMemo(() => {
        return (
            <Box display={'flex'}>
                {
                    check && <Checkbox value={isPlayed} onClick={() => setIsPlayed(p => !p)} />
                }
                <Tooltip arrow
                         title={<Typography>{hint}</Typography>}
                         placement={'top'} disableInteractive>
                    <ListItemButton ref={buttonRef} onClick={togglePlay}>
                        <ListItemIcon>
                            <Avatar sx={{ pointerEvents: 'none' }}
                                    src={icon}
                                    variant='rounded' />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant='h6' component='div'>
                                {label}
                            </Typography>
                        </ListItemText>
                        {isSelected && isPlaying ? <PauseRounded color={'action'} /> :
                            <PlayArrowRounded color={'action'} />}
                    </ListItemButton>
                </Tooltip>
            </Box>
        );
    }, [isPlaying, isSelected, check, isPlayed, i18n.resolvedLanguage, preference.autoClip]);
};

export default MusicItem;