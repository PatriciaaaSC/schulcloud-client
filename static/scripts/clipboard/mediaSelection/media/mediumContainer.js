import React from 'react';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';

import Thumbnail from './thumbnail';

const styles = theme => ({
    root:{
        backgroundColor: theme.palette.primary.main,
        maxWidth: 150,
        minWidth: 150,
        margin: 5,
        paddingBottom: 5,
        color: 'white',
        textAlign: 'center',
        overflow: 'hidden',
        cursor: 'grab',
    },
    isDragging: {
        opacity: 0.5 
    }
});

@withStyles(styles)
export default class MediumContainer extends React.PureComponent {
    render() {
        const { medium, url, isDragging, progress, classes, onClick } = this.props;

        return  <Card 
                    className={classes.root + (isDragging ? ' ' + classes.isDragging : '')}
                    onClick={onClick}
                >
                    <CardActionArea>
                        <Thumbnail 
                            medium={medium} 
                            url={url} 
                            infoClassName={classes.info}
                        />
                        {progress !== undefined && 
                            <LinearProgress variant="determinate" value={progress} />
                        }
                    </CardActionArea>
                </Card>;
    }
}