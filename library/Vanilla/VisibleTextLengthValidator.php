<?php
/**
 * @author Patrick Kelly <patrick.k@vanillaforums.com>
 * @copyright 2009-2020 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

namespace Vanilla;

use Vanilla\Invalid;
use Vanilla\Formatting\FormatService;
use Vanilla\Contracts\LocaleInterface;

/*
 * Validates the Body field length by stripping any formatting code.
 */
class VisibleTextLengthValidator {

    /** @var \Vanilla\Contracts\LocaleInterface */
    private $locale;

    /** @var \Vanilla\Formatting\FormatService */
    private $formatService;

    /** @var int */
    private $maxTextLength = 8000;

    public function __construct(int $maxTextLength, \Vanilla\Formatting\FormatService $formatService, \Vanilla\Contracts\LocaleInterface $locale) {
        $this->locale = $locale;
        $this->formatService = $formatService;
        $this->maxTextLength = $maxTextLength;
    }

    /**
     * Validate content length by stripping most meta-data and formatting.
     *
     * @param string $value User input content.
     * @param string $field Field name where content is found.
     * @param array $post POST array.
     * @return mixed Either an Invalid Object or the value.
     */
    private function validate($value, $field, $post) {
        $format = $post['Format'] ?? '';
        $stringLength = $this->formatService->getVisibleTextLength($value, $format);
        $diff = $stringLength - ($field->maxTextLength ?? $this->maxTextLength);
        if ($diff <= 0) {
            return $value;
        } else {
            $validationMessage = $this->locale->translate('ValidateLength' ?? '');
            $fieldName = $this->locale->translate($field->Name ?? '');
            return new Invalid(sprintf($validationMessage, $fieldName, abs($diff)));
        }
    }

    /**
     * Execute validate function for visible text validator.
     *
     * @param string $value User input content.
     * @param string $field Field name where content is found.
     * @param array $row POST array.
     * @return mixed Either an Invalid Object or the value.
     */
    public function __invoke($value, $field, $row = []) {
        return $this->validate($value, $field, $row);
    }
}
