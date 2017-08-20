import React, { Component } from 'react';
import {
    Image
} from 'react-native';
import FileUtil from '../Utils/fileUtil';

const DefaultPhotoImage = require('../img/default_photo.png');
const DefaultHeadImage = require('../img/default_head.png');

export default class CacheImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: this.props.source ? this.props.source : (this.props.cacheType == 'photo' ? DefaultPhotoImage : DefaultHeadImage),
            envUrl: this.props.envUrl,
            url: this.props.url
        };
    }

    setNativeProps(nativeProps) {
        this._image.setNativeProps(nativeProps);
    }

    componentWillReceiveProps(nextProps) {
        let {source, envUrl, url} = nextProps;
        if (envUrl !== this.props.envUrl || url !== this.props.url) {
            this.setState({ envUrl: envUrl, url: url })
            this.loadImage();
        } else if (source !== this.props.source) {
            this.setState({ imageSource: nextProps.source });
        }
    }

    componentWillMount() {
        this.loadImage();
    }

    async loadImage() {
        if (this.state.envUrl.length > 0 || this.state.url.length > 0) {
            let data = await FileUtil.cacheImage(false, this.state.envUrl, this.state.url);
            this.setState({ imageSource: data });
        }

    }

    render() {
        //console.log('render', this.state.imageSource);
        return (
            <Image ref={(img) => { this._image = img }} {...this.props} source={this.state.imageSource} />
        )
    }
}

CacheImage.defaultProps = {
    source: null,
    envUrl: '',
    url: '',
    cacheType: 'photo'
};

CacheImage.propTypes = {
    source: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.object]),
    envUrl: React.PropTypes.string,
    url: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    cacheType: React.PropTypes.oneOf(['photo', 'head'])
};