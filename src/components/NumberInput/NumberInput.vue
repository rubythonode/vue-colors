<template>
	<div class='vc-number'>
		<div class='label'>{{label}}</div>
		<div class='input'>
			<button
				class='vc-number-btn'
				:class='{ active: !downDisabled && downActive, disabled: downDisabled }'
				@click='handleDown'
				@mousedown='handleDownHold'
				@touchstart='handleDownHold'
			>-</button>
			<input 
				class='vc-number-input'
				:class='{ disabled: disabled }'
				:style='inputStyle'
				:disabled='disabled'
				:type='inputType' 
				:value='inputValue' 
				:min='min'
				:max='max'
				:step='step'
				@change='handleChange'
				:placeHolder='placeHolder'
			/>
			<button
				class='vc-number-btn'
				:class='{ active: !upDisabled && upActive, disabled: upDisabled }'
				@click='handleUp'
				@mousedown='handleUpHold'
				@touchstart='handleUpHold'
			>+</button>
		</div>
	</div>
</template>

<script>
import numberToHex from '../../utils/numberToHex'
import hexToNumber from '../../utils/hexToNumber'
/**
 * 以越来越短的间隔调用函数，直到返回的函数被调用。
 * @call  {[function]} 回调函数
 * @return {[function]} 返回函数，执行后停止回调函数调用
 */
function increaseInvoke(call) {
	let start = new Date()
	let duration = 0
	let timer = null
	const increase = () => {
		duration = (new Date() - start) / 1000
		let time = 35 + 1000 / (1 + duration * duration * duration)
		timer = setTimeout(() => {
			call()
			increase()
		}, time)
	}
	increase()
	return () => {
		clearTimeout(timer)
		timer = null
	}
}


export default {
	name: 'NumberInput',

	props: {
		value: {
			type: Number,
			default: 8
		},
		min: {
			type: Number,
			//default: -Infinity
			default: 0
		},
		max: { 
			type: Number,
			//default: +Infinity

			default: 10
		},
		step: {
			validator(v) {
				return v > 0
			},
			default: 1
		},
		fixed: {
			validator(v) {
 				return v === 'auto' || v >= 0 || v <= 20
			},
			default: 'auto'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeHolder: {
			type: String,
			default: '请输入数字'
		},
		label: String,
		hex: {
			type: Boolean,
			default: false
		},
		inputStyle: Object
	},

	data() {
		return {
			currValue: 0,
			upDisabled: false,
			downDisabled: false,
			upActive: false,
			downActive: false
		}
	},

	computed: {
		inputValue () {
			return this.hex ? numberToHex(this.currValue) : this.currValue
		},
		inputType () {
			return this.hex ? 'text' :　'number'
		}
	},

	methods: {
		setValue(v, isEmit=true) {
			let {min, max} = this

			if(this.disabled) {
				this.upDisabled = true 
				this.downDisabled = true
				return
			}

			if(v >= max) {
				v = max
				this.upDisabled = true
				this.downDisabled = false
			} else if (v <= min) {
				v = min 
				this.downDisabled = true
				this.upDisabled = false
			} else {
				this.upDisabled = false 
				this.downDisabled = false
			}

			if(v !== this.currValue) {
				isEmit && this.$emit('change', v)
				let fixedValue = this.fix(v)
				this.currValue = fixedValue
			}
		},
		handleChange(e) {
			const value = e.target.value
			const v = this.hex ? hexToNumber(value) : Number(value)
			if(isNaN(v)) {
				this.setValue(0)
				return false
			}
			this.setValue(v)
		},
		handleUp() { 
			this.setValue(this.currValue + this.step)

		},
		handleDown() {
			this.setValue(this.currValue - this.step)
		},
		handleUpHold() {
			if(this.upDisabled) {
				return 
			}
			this.clearTimer && this.clearTimer()
			this.clearTimer = increaseInvoke(this.handleUp)
			document.addEventListener('mouseup', this.handleLeave)
			document.addEventListener('touchend', this.handleLeave)
			this.upActive = true 
		},
		handleDownHold() {
			if(this.downDisabled) {
				return
			}
			this.clearTimer && this.clearTimer()
			this.clearTimer = increaseInvoke(this.handleDown)
			document.addEventListener('mouseup', this.handleLeave)
			document.addEventListener('touchend', this.handleLeave)
			this.downActive = true
		},
		handleLeave() {
			this.clearTimer()
			document.removeEventListener('mouseup', this.handleLeave)
			document.removeEventListener('touchend', this.handleLeave)
			this.upActive = false
			this.downActive = false
		},
		fix (v) {
			if(this.fixed === 'auto') {
				let fixed = Math.log10(1 / this.step)
				return Number(Number(v).toFixed(fixed))
			} else {
				return Number(v).toFixed(this.fixed)
			}
		}
	},

	watch: {
		value (v) {
			this.setValue(v, false)
		}
	},

	beforeDestroy () {
		document.removeEventListener('mouseup', this.handleLeave)
		this.clearTimer && this.clearTimer()
	},
	beforeMount () {
		this.setValue(this.value, false)
	}
}
</script>

<style scoped>
.vc-number {
	box-sizing: border-box;
	width: 100%;
	font-size: 0;
	margin-bottom: 12px;
}
.vc-number .label {
	display: inline-block;
	width: 20px;
	line-height: 34px;
	vertical-align: top;
	font-size: 16px;
	color: rgba(0,0,0,0.87);
}
.vc-number .input {
	display: inline-block;
}
.vc-number-btn {
	box-sizing: border-box;
	display: inline-block;
	width: 28px;
	font-size: 20px;
	text-align: center;
	line-height: 34px;
	border-radius: 2px;
	background: #fff;
	cursor: pointer;
	user-select: none; 
	outline: none;
	border: none;
	color: #333;
	transition: all 125ms cubic-bezier(0.4,0,0.6,1);
	box-shadow: rgba(0,0,0,0.28) 0 1px 3px;
	padding: 0;
	font-family: Consolas;
}
.vc-number-btn.active {
	color: #666;
	background: #f5f5f5;
	box-shadow: rgba(0,0,0,0.16) 0 1px 2px;
}
.vc-number-btn.disabled {
  background: #f0f0f0;
  color: rgba(0,0,0,0.33);
  box-shadow: none;
  cursor: default;
} 
.vc-number-input {
	box-sizing: border-box;
	border: 1px solid #f0f0f0;
	width: 70px;
	height: 34px;
	font-size: 14px;
	vertical-align: top;
	padding-left: 16px;
	font-family: Consolas;
}
.vc-number-input.disabled {
	color: rgba(0,0,0,0.33);
}
</style>