import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css'

class PlaceHelper extends React.Component {

    state = {
        inputAdress: '',
        findedData: [],
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

    takeData = (address) => {
        fetch(`http://photon.komoot.de/api/?q=${address}&limit=10`)
            .then((data) => data.json())
            .then(data => this.setState({ findedData: data.features, choosen: false, onLoad: false }));
    }

    checkOfUndef = (data) => data !== undefined ? data : '';

    timer = 0;

    render() {
        const {
            customInput,
            customDataList,
            customLoader,
            classNameCommon,
            classNameInput,
            classNameList,
            filterOptions,
            onChangeDelay,
            listServerLimit,
            listlocalLimit,
            returnedDataInput,
            ...other
        } = this.props;

        let UpdatedCustomInput = customInput !== undefined 
        ? React.cloneElement(
            this.props.customInput,
            {
                onChange: (e) => {
                    let value = e.target.value;
                    clearTimeout(this.timer);
                    this.timer = setTimeout(this.takeData, this.props.onChangeDelay, value);
                    this.setState({ inputAdress: value, onLoad: true });

                    if (this.props.returnedDataInput !== undefined) this.props.returnedDataInput(e.target.value)
                },
                value: this.state.inputAdress //почему не апдейтится?
            }
        )
        : null;

        const checkOfUndef = this.checkOfUndef;

        return (
            <div className={`Place-helper ${classNameCommon}`}>

                {/* Как передать через кастомный атрибут-компонент и заполнить его внутри такими же атрибутами как у input ниже */}
                {
                    UpdatedCustomInput
                }
                {customInput===undefined&&<input
                    className={`Place-helperList ${classNameInput}`}
                    value={this.state.inputAdress}
                    onChange={(e) => {
                        let value = e.target.value;
                        clearTimeout(this.timer);
                        this.timer = setTimeout(this.takeData, onChangeDelay, value);
                        this.setState({ inputAdress: value, onLoad: true });

                        if (returnedDataInput !== undefined) returnedDataInput(e.target.value)
                    }}
                    {...other}
                />}
                {
                    !this.state.choosen &&
                    <ul className={`${classNameList}`}>
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
                {
                    this.state.onLoad && <span>Loading...</span>
                }
            </div>
        );
    }
}

export default PlaceHelper;

PlaceHelper.propTypes = {
    customInput: PropTypes.element, //пользовательский input
    customDataList: PropTypes.element, //пользовательский список вывода данных
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