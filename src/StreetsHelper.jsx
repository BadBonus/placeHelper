import React, { Component } from 'react';
import PropTypes from 'prop-types';

import iconWriting from './pencil.svg'
import './style.css'

class PlaceHelper extends React.Component {

    state = {
        inputAdress: '',
        findedData: [],
        writing: false,
        choosen: false,
        onLoad: false
    };

    componentDidMount() {
    }

    componentDidUpdate(oldProps, oldState) {
        const { returnedDataList } = this.props;
        if (returnedDataList !== undefined) {
            if (this.state.findedData !== oldState.findedData) {
                returnedDataList(this.state.findedData);
            }
        }
    }

    takeData = (address, limit) => {
        fetch(`http://photon.komoot.de/api/?q=${address}&limit=${limit}`)
            .then((data) => data.json())
            .then(data => this.setState({ findedData: data.features, choosen: false, onLoad: false }));
    }

    checkOfUndef = (data) => data !== undefined ? data : '';

    timer = 0;

    render() {
        const {
            // customDataList,
            customLoader,
            classNameCommon,
            classNameInput,
            classNameList,
            filterOptions,
            listServerLimit,
            onChangeDelay,
            listlocalLimit,
            returnedDataInput,
            optionsForInput,
            optionsForContainer,
            optionsForList
        } = this.props;

      

        const checkOfUndef = this.checkOfUndef;

        return (
            <div className={`Place-helper ${classNameCommon}`} {...optionsForContainer}>

                <div className={'wrapperForInputAndLoader'}>
                    <input
                        className={`Place-helperInput ${classNameInput}`}
                        value={this.state.inputAdress}
                        onChange={(e) => {
                            let value = e.target.value;
                            clearTimeout(this.timer);

                            this.timer = setTimeout(()=>{
                                this.setState({writing:false, onLoad:true, findedData: []});
                                this.takeData(value, listServerLimit);
                            },onChangeDelay);

                            // this.setState({ inputAdress: value, onLoad: true });
                            this.setState({ inputAdress: value, writing:true});
                            if (returnedDataInput !== undefined) returnedDataInput(e.target.value)
                        }}
                        {...optionsForInput}
                    />
                    {
                        this.state.onLoad && <>{customLoader !== undefined ?customLoader:<div className="loader"></div>}</>
                    }
                    {
                        this.state.writing && <img className='iconWriting' src={iconWriting}/>
                    }
                </div>
                {
                    (!this.state.choosen && this.state.findedData.length !== 0) &&
                    <ul className={`${classNameList}`} {...optionsForList}>
                        {
                            this.state.findedData.map((el) => {
                                const { country, state, city, street, name, osm_id } = el.properties;
                                const fullData = `${checkOfUndef(country)} ${checkOfUndef(state)} ${checkOfUndef(city)} ${checkOfUndef(street)} ${checkOfUndef(name)}`;
                                return (
                                    <li onClick={() => { this.setState({ inputAdress: fullData, choosen: true }) }} key={osm_id}>
                                        {
                                            fullData
                                        }
                                    </li>)
                            }
                            )
                        }
                    </ul>
                }
            </div>
        );
    }
}

export default PlaceHelper;

PlaceHelper.propTypes = {
    // customDataList: PropTypes.element, //пользовательский список вывода данных
    customLoader: PropTypes.element, //пользовательский loader
    returnedDataList: PropTypes.func, //функция что будет принимать данные с сервера
    returnedDataInput: PropTypes.func, //функция что будет принимать value input
    classNameCommon: PropTypes.string, //css-класс для всего компонента
    classNameInput: PropTypes.string, //css-класс для стандартного input
    classNameList: PropTypes.string, //css-класс для стандартного list
    filterOptions: PropTypes.shape({ //опции фильтра для вывода конкретного типа элементов
        country: PropTypes.bool,
        city: PropTypes.bool,
        streets: PropTypes.bool
    }),
    onChangeDelay: PropTypes.number, //задержка отправки введенных в input данных на сервер,
    listServerLimit: PropTypes.number, //лимит объектов с сервера
    listlocalLimit: PropTypes.number, //лимит объектов с сервера
    optionsForInput:PropTypes.object, //любые опции для input
    optionsForContainer:PropTypes.object, //любые опции для контейнера-div
    optionsForList:PropTypes.object, //любые опции для списка выводимых объектов
};

PlaceHelper.defaultProps = {
    classNameCommon: '',
    classNameInput: '',
    classNameList: '',
    filterOptions: PropTypes.shape({ //опции фильтра для вывода конкретного типа элементов
        country: true,
        city: true,
        streets: true
    }),
    onChangeDelay: 800, //задержка отправки введенных в input данных на сервер,
    listServerLimit: 10, //лимит объектов с сервера
};