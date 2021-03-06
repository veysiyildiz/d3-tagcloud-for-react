import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import d3Cloud from 'd3-cloud';
import './styles.css';

export function renderData(data) {
  const renderedDataArray = data.map( (item) =>
    <div 
      key={item.label}
      style={{
        fontSize: item.fontSize ? item.fontSize*5+16 : '',
        opacity: item.opacity ? item.opacity/10 : '',
        padding: item.padding ? item.padding : '',
        fontWeight: 'bold',
      }}
    >
      {item.label}
    </div>
  );
  return renderedDataArray;
}

class TagCloud extends Component {
	constructor(props) {
		super(props);
		this._width = 0;
		this._height = 0;
		this.state = {
			wrappedChildren: []
		};
		this.text = this.text.bind(this);
		this.fontFamily = this.getStyleValue.bind(this, 'fontFamily');
		this.fontSize = this.getStyleValue.bind(this, 'fontSize');
		this.fontWeight = this.getStyleValue.bind(this, 'fontWeight');
		this.fontStyle = this.getStyleValue.bind(this, 'fontStyle');
		this.padding = this.getStyleValue.bind(this, 'padding');
		this.rotate = this.rotate.bind(this);
		this.onResize = this.onResize.bind(this);
		this.randomColor = this.randomColor.bind(this);
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		if (this._resizeTimer) {
			clearTimeout(this._resizeTimer);
			this._resizeTimer = undefined;
		}
		this._mounted = false;
	}

	componentWillReceiveProps(nextProps) {
		this.updateLayout(nextProps, true);
  }
  
  randomColor(colorarray) {
    if (colorarray) {
      return colorarray[Math.floor((Math.random()*colorarray.length))];
    } else {
      let r = Math.round(Math.random() * 255);
      let g = Math.round(Math.random() * 255);
      let b = Math.round(Math.random() * 255);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }


	updateLayout(props) {
		const width = this._width;
    const height = this._height;
    
		if (!width || !height) {
			return;
		}
		this.calculateLayout(props).then((children) => {
			if (!this._mounted) return;
			this.setState({
				wrappedChildren: children
      });
		});
	}

	calculateLayout(props) {
		const {children, random} = props;
		const width = this._width;
		const height = this._height;
    
		return new Promise((resolve) => {
			d3Cloud()
				.size([width, height])
				.words(React.Children.map(children, (child) => ({child})))
				.text(this.text)
				.font(this.fontFamily)
				.fontStyle(this.fontStyle)
				.fontWeight(this.fontWeight)
				.fontSize(this.fontSize)
				.rotate(this.rotate)
        .padding(this.padding)
				.random(random)
				.on('end', (items) => {
					const newChildren = items.map((item, index) => {
						let x = item.x;
						x += item.x0;
						x += (width / 2);
						let y = item.y;
						y += item.y0;
						y += (height / 2);
						const transform = `translate(${x}px,${y}px) rotate(${item.rotate}deg)`;
						const style = {
							position: 'absolute',
              color: this.props.style.color || this.randomColor(this.props.colorarray),
							...item.child.props.style,
							fontFamily: item.font,
							fontSize: item.size,
              fontWeight: item.weight,
							fontStyle: item.style,
              width: item.width,
							textAlign: 'center',
							whiteSpace: 'nowrap',
							transformOrigin: 'center bottom',
							WebkitTransform: transform,
							MozTransform: transform,
							MsTransform: transform,
							OTransform: transform,
              transform: transform,
						};						
						if (this.props.style.color && (typeof this.props.style.color === 'function')) {
							style.color = this.props.style.color(item.child, index);
            }
						return React.cloneElement(
							item.child,
							{
								...item.child.props,
								key: item.text,
								style: style,
							},
							item.child.props.children
						);
					});
					resolve(newChildren);
				})
				.start();
		});
	}

	getStyleValue(propName, word) {
		const childValue = word.child.props.style ? word.child.props.style[propName] : undefined;
		let value = childValue || this.props.style[propName] || TagCloud.defaultProps.style[propName];
		if (typeof value === 'function') {
			value = value(word.child.props);
		}
		if (propName === 'fontSize') value += 2;
		return value;
	}

	rotate(word) {
		const value = word.child.props.rotate || this.props.rotate || TagCloud.defaultProps.rotate;
		if (typeof value === 'function') {
			return value(word.child.props);
		}
		else {
			return value;
		}
	}

	text(word) {
		let text = word.child.props.text;

		if (!text) {
			const children = word.child.props.children;

			if (Array.isArray(children)) {
				text = children[0];
			} else {
				text = children;
			}
		}

		return text;
	}

	render() {
		const {children, style, rotate, random, ...props} = this.props;
		const {fontFamily, fontSize, fontWeight, fontStyle, padding, ...otherStyle} = style;
		const {wrappedChildren} = this.state;

		return (
			<Measure bounds={true} onResize={this.onResize}>
				{({ measureRef }) => <div ref={measureRef} {...props} style={otherStyle}>
	        		{wrappedChildren}
	      		</div>}
			</Measure>
		);
	}

	onResize({bounds}) {
		const {width, height} = bounds;
		if ((this._width !== width) || (this._height !== height)) {
			this._width = width;
			this._height = height;
			if (this._resizeTimer) clearTimeout(this._resizeTimer);
			this._resizeTimer = setTimeout(() => {
				this._resizeTimer = undefined;
				this.updateLayout(this.props);
			}, 200);
		}
	}
}


TagCloud.propTypes = {
	children: PropTypes.any,
	style: PropTypes.shape({
		fontFamily: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string
		]),
		fontStyle: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string
		]),
		fontWeight: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.number,
			PropTypes.string
		]),
		fontSize: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.number
		]),
		padding: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.number
		]),
		opacity: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.number
		])
	}),
	rotate: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.number
	]),
	colorarray:  PropTypes.array,
	data:  PropTypes.array,
	random: PropTypes.func
};

TagCloud.defaultProps = {
	style: {
		fontFamily: 'serif',
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 30,
    padding: 10,
    opacity: 1
	},
  rotate: 0,
  colorarray: null,
  data: null,
	random: Math.random
};

export default TagCloud;