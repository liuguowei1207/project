import React from 'react';
import {connect} from 'react-redux';
import {Carousel,Icon,Button} from 'antd';
import {Link} from 'react-router-dom';
import {queryBanner,queryList} from '../../api/home';
import action from '../../store/action/index';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: [],
            data: [],
            listData: {},
            isLoading: false
        }
    };

    async componentWillMount() {
        this.bannerData = await queryBanner();
        this.setState({
            arr: this.bannerData.arr
        });
        this.listData = await queryList({
            limit: 10,
            page: 1
        });
        this.setState({
            data: this.listData.data,
            listData: this.listData
        });
    }

    loadMore = async ()=> {
        //=>防止重复点击
        if (this.state.isLoading) return;
        this.setState({isLoading: true});

        this.listData = await queryList({
            page: parseFloat(this.state.listData.page) + 1,
            limit: 10,
        });
        this.setState({
            data: this.state.data.concat(this.listData.data),
            listData: this.listData
        }, ()=> {
            this.setState({isLoading: false});
        });
    };


    render() {
        return <div className="listBox">
            {/*轮播图*/}
            {this.state.arr && (this.state.arr.length > 0) ? (<Carousel autoplay>
                {this.state.arr.map((item, index)=> {
                    return <div key={index}>
                        <img src={item.pic} alt={item.name}/>
                    </div>;
                })}
                {/*<div><img src={require('../../static/images/1.jpg')} alt=""/></div>
                 <div><img src={require('../../static/images/2.jpg')} alt=""/></div>
                 <div><img src={require('../../static/images/5.jpg')} alt=""/></div>
                 <div><img src={require('../../static/images/3.jpg')} alt=""/></div>
                 <div><img src={require('../../static/images/4.jpg')} alt=""/></div>*/}
            </Carousel>) : ''}

            {/*分类*/}
            <ul className="sort">
                <li>
                    <img src="http://p1.meituan.net/jungle/8b5e1702d4145ccf058ba5fb31008c5310912.png" alt=""/>
                    <p>美食</p>
                </li>
                <li>
                    <img src="http://p0.meituan.net/jungle/45ff2f098a20a77122bff8385192f0ec10547.png" alt=""/>
                    <p>美团超市</p>
                </li>
                <li>
                    <img src="http://p1.meituan.net/jungle/12a9834827909fa55f54bce96e67470711250.png" alt=""/>
                    <p>生鲜果蔬</p>
                </li>
                <li>
                    <img src="http://p1.meituan.net/jungle/da9181f93dd2e11c5d74cf685470408f10016.png" alt=""/>
                    <p>美团专送</p>
                </li>
                <li>
                    <img src="http://p1.meituan.net/jungle/a2a306c5467aba7fac8d7410d161f8db9364.png" alt=""/>
                    <p>下午茶</p>
                </li>
                <li>
                    <img src="http://p0.meituan.net/jungle/58b60a312cf86f3a3afc4c96ff0e53438774.png" alt=""/>
                    <p>汉堡披萨</p>
                </li>
                <li>
                    <img src="http://p0.meituan.net/jungle/2ec76f8f4f21a4ec163adc7fccfa1a399428.png" alt=""/>
                    <p>小吃馆</p>
                </li>
                <li>
                    <img src="http://p0.meituan.net/jungle/2eee7747fd143249b100b9fa5ee5e31d9873.png" alt=""/>
                    <p>家常菜</p>
                </li>
            </ul>

            {/*数据列表*/}
            <div className="moreSeller">
                <h2>
                    附近商家
                </h2>
                {this.state.data && this.state.data.length !== 0 ? (<div>
                    <ul className="sellerList">
                        {this.state.data.map((item, index)=> {
                            return <li className="clearfix" key={index}>
                                <Link to={{pathname:'/home/list',
                        search:`?listId=${item.id}`}}>
                                    <div className="sellerLeft"><img src={item.seller.avatar} alt=""/>
                                        {this.props.cat[item.id]?<span>{this.props.cat[item.id]["totalNum"]}</span>:
                                            null}
                                    </div>

                                    <div className="sellerRight">
                                        <h3>{item.seller.name}</h3>
                            <span className="star">
                                <Icon type="star"/>
                                <Icon type="star"/>
                                <Icon type="star"/>
                                <Icon type="star"/>
                                <Icon type="star"/>
                            </span>
                                        <span>月售{item.seller.sellCount}</span>

                                        <span>{item.seller.deliveryTime}min</span>
                                        <span>|</span>
                                        <span>{item.seller.description}</span>
                                        <br/>
                                        <span>起送价¥{item.seller.minPrice}</span>
                                        <span>|</span>
                                        <span>配送¥{item.seller.deliveryPrice}</span>
                                        <p>
                                            <img className="piao"
                                                 src="http://p0.meituan.net/xianfu/476ba65ee80b6385bab292c085baed17940.png.webp"
                                                 alt=""/>
                                            &nbsp;
                                            {item.seller.infos[0]}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        })}
                    </ul>
                    <div className="noMore">
                        {this.listData.total <= this.listData.page ?
                            <span>暂无更多数据</span> :
                            (<Button onClick={this.loadMore} loading={this.state.isLoading}>加载更多数据</Button>)}</div>
                </div>) :
                    '暂无数据'}
            </div>
        </div>;
    }
}

export default connect(state => ({...state.home,...state.detail}), action.home)(List);