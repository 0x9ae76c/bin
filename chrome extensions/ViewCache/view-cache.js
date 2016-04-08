(function() {
	var Main, HTML, CSS, B64
	var d

	d = document
		/// Summary
		/// Get DataType, Determine Output, Determine Codepath, Kill Self d-(OuO )z
		/// Only working on images for now DankMemes
	Main = {
		init: function() {
			var dataType, bin
			dataType = this.getDataType()

			if (dataType.indexOf('image') !== -1) {
				bin = document.querySelectorAll('pre')[2].textContent.split('\n')
				bin = bin.slice(0, bin.length - 1)

				bin = bin.map(function(line) {
					return line.split(': ')[1].split('  ')[0]
				}).map(function(line) {
					return line.split(' ').map(function(hex) {
						return Number.parseInt(("" + hex), 16)
					})
				}).reduce(function(a, b) {
					return a.concat(b)
				})
				bin = B64.base64ArrayBuffer(bin)
				HTML.Image(bin, dataType)
			}

		},
		getDataType: function() {
			var contentType = document.querySelector('pre').textContent.split('\n')
			for (i = 0; i < contentType.length; i++) {
				if (contentType[i].indexOf('Content-Type') != -1) {
					contentType = contentType[i].split(': ')[1]
					break;
				}
			}
			return contentType
		}
	}

	B64 = {
		base64ArrayBuffer: function(arrayBuffer) {
			var base64 = ''
			var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

			var bytes = new Uint8Array(arrayBuffer)
			var byteLength = bytes.byteLength
			var byteRemainder = byteLength % 3
			var mainLength = byteLength - byteRemainder

			var a, b, c, d
			var chunk

			// Main loop deals with bytes in chunks of 3
			for (var i = 0; i < mainLength; i = i + 3) {
				// Combine the three bytes into a single integer
				chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

				// Use bitmasks to extract 6-bit segments from the triplet
				a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
				b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
				c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
				d = chunk & 63 // 63       = 2^6 - 1

				// Convert the raw binary segments to the appropriate ASCII encoding
				base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
			}

			// Deal with the remaining bytes and padding
			if (byteRemainder == 1) {
				chunk = bytes[mainLength]

				a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

				// Set the 4 least significant bits to zero
				b = (chunk & 3) << 4 // 3   = 2^2 - 1

				base64 += encodings[a] + encodings[b] + '=='
			} else if (byteRemainder == 2) {
				chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

				a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
				b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

				// Set the 2 least significant bits to zero
				c = (chunk & 15) << 2 // 15    = 2^4 - 1

				base64 += encodings[a] + encodings[b] + encodings[c] + '='
			}

			return base64
		}
	}

	HTML = {
		Image: function(b64, type) {
			var im, head
			head = 'data:' + type + ';base64,'
			im = document.createElement('img')
			im.src = head + b64
			document.body.appendChild(im)
		},
		Html: function(notimplemented) {
			console.log('PEPE')
		}
	}


	Main.init()
}).call(this)